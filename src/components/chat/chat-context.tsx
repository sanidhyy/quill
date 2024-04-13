import { useMutation } from "@tanstack/react-query";
import { type PropsWithChildren, createContext, useState, useRef } from "react";
import { toast } from "sonner";

import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { AI_RESPONSE_MESSAGE_ID } from "@/config/message";
import type { Messages } from "@/types/message";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

export const ChatContextProvider = ({
  fileId,
  children,
}: PropsWithChildren<{
  fileId: string;
}>) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backupMessage = useRef("");

  const utils = trpc.useUtils();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message.");

      return response.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");

      // cancel any outgoing messages
      await utils.getFileMessages.cancel();

      // snapshot previous values
      const prevMessages = utils.getFileMessages.getInfiniteData();

      // optimistically insert new value in state
      utils.getFileMessages.setInfiniteData(
        {
          fileId,
          limit: INFINITE_QUERY_LIMIT,
        },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          // cloning old pages
          let newPages = [...old.pages];
          let latestPage = newPages[0]!;

          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];

          // inject into new pages
          newPages[0] = latestPage;

          return {
            ...old,
            pages: newPages,
          };
        },
      );

      setIsLoading(true);

      return {
        previousMessages:
          prevMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        return toast.error("There was a problem sending this message.", {
          description: "Please refresh this page and try again.",
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // accumulated response
      let accResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        const chunkValue = decoder.decode(value);

        // Extract the string value from the chunk
        const extractedValue = chunkValue.match(/"([^"]+)"/)?.[1] || "";

        accResponse += extractedValue;

        // append chunk to the actual message
        utils.getFileMessages.setInfiniteData(
          { fileId, limit: INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) return { pages: [], pageParams: [] };

            // check if message is already created
            let isAiResponseCreated = old.pages.some((page) =>
              page.messages.some(
                (message) => message.id === AI_RESPONSE_MESSAGE_ID,
              ),
            );

            let updatedPages = old.pages.map((page) => {
              // if it is last page
              if (page === old.pages[0]) {
                let updatedMessages: Messages;

                if (!isAiResponseCreated) {
                  updatedMessages = [
                    {
                      createdAt: new Date().toISOString(),
                      id: AI_RESPONSE_MESSAGE_ID,
                      text: accResponse,
                      isUserMessage: false,
                    },
                    ...page.messages,
                  ];
                } else {
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === AI_RESPONSE_MESSAGE_ID) {
                      return {
                        ...message,
                        text: accResponse,
                      };
                    }

                    return message;
                  });
                }

                return {
                  ...page,
                  messages: updatedMessages,
                };
              }

              return page;
            });

            return { ...old, pages: updatedPages };
          },
        );
      }
    },
    onError: (_error, _var, context) => {
      setMessage(backupMessage.current);
      utils.getFileMessages.setData(
        { fileId },
        { messages: context?.previousMessages ?? [] },
      );
    },
    onSettled: async () => {
      setIsLoading(false);

      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = () => {
    if (message.trim().length === 0) return;

    sendMessage({ message });
  };

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
