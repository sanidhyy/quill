"use client";

import { ChatWrapper } from "@/components/chat/chat-wrapper";
import dynamic from "next/dynamic";

const PDFRenderer = dynamic(() => import("@/components/pdf-renderer"), {
  ssr: false,
});

interface FileIdClientProps {
  fileId: string;
  fileUrl: string;
}

export const FileIdClient = ({ fileId, fileUrl }: FileIdClientProps) => {
  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* left side */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PDFRenderer url={fileUrl} />
          </div>
        </div>

        {/* right side */}
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={fileId} />
        </div>
      </div>
    </div>
  );
};
