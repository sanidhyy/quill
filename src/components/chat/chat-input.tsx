"use client";

import { Send } from "lucide-react";
import { useContext, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ChatContext } from "./chat-context";

type ChatInputProps = {
  isDisabled?: boolean;
};

export const ChatInput = ({ isDisabled }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <form
        onSubmit={(e) => e.preventDefault()}
        autoCapitalize="off"
        autoComplete="off"
        className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
      >
        <div className="relative flex h-full flex-1 items-stretch flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="Enter your question..."
                rows={1}
                maxRows={4}
                autoFocus
                disabled={isLoading || isDisabled}
                aria-disabled={isLoading || isDisabled}
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    addMessage();

                    textareaRef.current?.focus();
                  }
                }}
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
              />

              <Button
                disabled={isLoading || isDisabled}
                aria-disabled={isLoading || isDisabled}
                type="submit"
                onClick={() => {
                  addMessage();

                  textareaRef.current?.focus();
                }}
                className="absolute bottom-1.5 right-[8px]"
                aria-label="Send Message..."
                title="Send Message..."
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
