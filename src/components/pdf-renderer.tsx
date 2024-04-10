"use client";

import { Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "sonner";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PDFRendererProps = {
  url: string;
};

export const PDFRenderer = ({ url }: PDFRendererProps) => {
  const { width, ref } = useResizeDetector();

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      {/* topbar */}
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">top bar</div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <div ref={ref}>
          <Document
            loading={
              <div className="flex justify-center">
                <Loader2 className="my-24 h-6 w-6 animate-spin" />
              </div>
            }
            onLoadError={() =>
              toast.error("Error loading PDF.", {
                description: "Please try again.",
              })
            }
            file={url}
            className="max-h-full"
          >
            <Page pageNumber={1} width={width ? width : 1} />
          </Document>
        </div>
      </div>
    </div>
  );
};
