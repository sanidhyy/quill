import { Expand, Loader2 } from "lucide-react";
import { useState } from "react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type PdfFullscreenProps = {
  fileUrl: string;
};

export const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
  const { width, ref } = useResizeDetector();

  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [currPage, setCurrPage] = useState(1);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button
          aria-label="Fullscreen"
          title="Fullscreen"
          variant="ghost"
          className="gap-1.5"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() =>
                toast.error("Error loading PDF.", {
                  description: "Please try again.",
                })
              }
              file={fileUrl}
              className="max-h-full"
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <Page key={i} pageNumber={i + 1} width={width ? width : 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};
