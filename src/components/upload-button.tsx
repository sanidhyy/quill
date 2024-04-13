"use client";

import { Cloud, FileIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useUploadThing } from "@/lib/uploadthing";

type UploadDropzoneProps = {
  isSubscribed: boolean;
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
};

const UploadDropzone = ({
  isSubscribed,
  isUploading,
  setIsUploading,
}: UploadDropzoneProps) => {
  const router = useRouter();

  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload } = useUploadThing(
    isSubscribed ? "proPlanUploader" : "freePlanUploader",
    {
      onUploadError: (err) => {
        setIsUploading(false);
        if (err.code === "BAD_REQUEST") setError("Only PDF files are allowed.");

        if (err.code === "INTERNAL_SERVER_ERROR" || err.code === "TOO_LARGE")
          setError("File is too large.");

        if (err.code === "FILE_LIMIT_EXCEEDED" || err.code === "TOO_MANY_FILES")
          setError("Too many files.");
      },
    },
  );

  const startSimulatedProgress = () => {
    // reset upload progress
    setError("");
    setUploadProgress(0);

    // update progress every half second
    const interval = setInterval(() => {
      setUploadProgress((prevUploadProgress) => {
        // stop updating progress if exceeds 95 (taking too long...)
        if (prevUploadProgress >= 95) {
          clearInterval(interval);
          return prevUploadProgress;
        }

        // update progress by 5
        return prevUploadProgress + 5;
      });
    }, 500);

    return interval;
  };

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <Dropzone
      multiple={false}
      onDropRejected={() => setError("Too many files.")}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        // handle file upload
        const res = await startUpload(acceptedFile);

        if (!res) {
          return toast.error("Something went wrong!", {
            description: "Please try again later.",
          });
        }

        const [fileResponse] = res;

        const key = fileResponse?.key;

        if (!key) {
          return toast.error("Something went wrong!", {
            description: "Please try again later.",
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);

        startPolling({ key });
      }}
    >
      {({ getRootProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop.
                </p>

                <p className="text-xs text-zinc-500">
                  PDF (up to {isSubscribed ? "16" : "4"}MB)
                </p>
              </div>

              {/* render uploaded files */}
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xl bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <FileIcon className="h-4 w-4 text-blue-500" />
                  </div>

                  {/* file name */}
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {/* progress bar */}
              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* error */}
              {error && error.length !== 0 ? (
                <p className="mt-4 mx-auto text-sm text-rose-500">{error}</p>
              ) : null}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export const UploadButton = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Dialog
      open={isOpen || isUploading}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button
          disabled={isOpen || isUploading}
          aria-disabled={isOpen || isUploading}
        >
          Upload PDF
        </Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone
          isSubscribed={isSubscribed}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />
      </DialogContent>
    </Dialog>
  );
};
