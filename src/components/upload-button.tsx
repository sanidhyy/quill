"use client";

import { Cloud, FileIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useRef, useState } from "react";
import Dropzone, { type FileRejection } from "react-dropzone";
import { toast } from "sonner";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUploadThing } from "@/lib/uploadthing";
import { useRequireApiKeys } from "@/hooks/use-require-api-keys";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const FREE_MAX_FILE_SIZE_MB = 4;
const PRO_MAX_FILE_SIZE_MB = 16;

type UploadDropzoneProps = {
  isSubscribed: boolean;
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
};

const getDropzoneErrorMessage = (
  fileRejections: FileRejection[],
  maxFileSizeMb: number,
) => {
  const codes = new Set(
    fileRejections.flatMap((rejection) =>
      rejection.errors.map((error) => error.code),
    ),
  );

  if (codes.has("file-too-large")) {
    return `File is too large. Max size is ${maxFileSizeMb}MB.`;
  }

  if (codes.has("file-invalid-type")) {
    return "Only PDF files are allowed.";
  }

  if (codes.has("too-many-files")) {
    return "Too many files. Please upload one PDF at a time.";
  }

  return "Unable to upload this file.";
};

const getUploadThingErrorMessage = (
  err: { code: string; message: string },
  maxFileSizeMb: number,
) => {
  const details = `${err.code} ${err.message}`.toLowerCase();

  if (
    err.code === "TOO_LARGE" ||
    details.includes("filesizemismatch") ||
    details.includes("too large") ||
    details.includes("file size")
  ) {
    return `File is too large. Max size is ${maxFileSizeMb}MB.`;
  }

  if (
    err.code === "TOO_MANY_FILES" ||
    err.code === "FILE_LIMIT_EXCEEDED" ||
    details.includes("filecountmismatch")
  ) {
    return "Too many files. Please upload one PDF at a time.";
  }

  if (
    err.code === "FORBIDDEN" ||
    details.includes("unauthorized") ||
    details.includes("forbidden")
  ) {
    return "You must be signed in to upload files.";
  }

  if (
    details.includes("invalidfiletype") ||
    details.includes("unknownfiletype") ||
    details.includes("only pdf") ||
    details.includes("file type")
  ) {
    return "Only PDF files are allowed.";
  }

  if (err.code === "BAD_REQUEST") {
    return "Unable to upload this file. Please try a different PDF.";
  }

  return "Something went wrong while uploading. Please try again.";
};

const UploadDropzone = ({
  isSubscribed,
  isUploading,
  setIsUploading,
}: UploadDropzoneProps) => {
  const router = useRouter();

  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const handledUploadErrorRef = useRef(false);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const maxFileSizeMb = isSubscribed
    ? PRO_MAX_FILE_SIZE_MB
    : FREE_MAX_FILE_SIZE_MB;
  const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;

  const clearProgressInterval = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const { startUpload } = useUploadThing(
    isSubscribed ? "proPlanUploader" : "freePlanUploader",
    {
      onUploadError: (err) => {
        handledUploadErrorRef.current = true;
        clearProgressInterval();
        setIsUploading(false);
        setUploadProgress(0);
        setError(getUploadThingErrorMessage(err, maxFileSizeMb));
      },
    },
  );

  const startSimulatedProgress = () => {
    clearProgressInterval();

    // reset upload progress
    setError("");
    setUploadProgress(0);

    // update progress every half second
    progressIntervalRef.current = setInterval(() => {
      setUploadProgress((prevUploadProgress) => {
        // stop updating progress if exceeds 95 (taking too long...)
        if (prevUploadProgress >= 95) {
          clearProgressInterval();
          return prevUploadProgress;
        }

        // update progress by 5
        return prevUploadProgress + 5;
      });
    }, 500);
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
      accept={{
        "application/pdf": [".pdf"],
      }}
      maxSize={maxFileSizeBytes}
      multiple={false}
      onDropRejected={(fileRejections) => {
        clearProgressInterval();
        setIsUploading(false);
        setUploadProgress(0);
        setError(getDropzoneErrorMessage(fileRejections, maxFileSizeMb));
      }}
      onDrop={async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        handledUploadErrorRef.current = false;
        setIsUploading(true);

        startSimulatedProgress();

        // handle file upload
        const res = await startUpload(acceptedFiles);

        if (!res) {
          clearProgressInterval();
          setIsUploading(false);

          if (!handledUploadErrorRef.current) {
            setError("Something went wrong while uploading. Please try again.");
            toast.error("Something went wrong!", {
              description: "Please try again later.",
            });
          }
          return;
        }

        const [fileResponse] = res;

        const key = fileResponse?.key;

        if (!key) {
          clearProgressInterval();
          setIsUploading(false);
          setError("Something went wrong while uploading. Please try again.");
          toast.error("Something went wrong!", {
            description: "Please try again later.",
          });
          return;
        }

        clearProgressInterval();
        setUploadProgress(100);

        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop.
                </p>

                <p className="text-xs text-zinc-500">
                  PDF (up to {maxFileSizeMb}MB)
                </p>
              </div>

              {/* render uploaded files */}
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xl bg-white flex items-center rounded-md overflow-hidden outline-solid outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
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

            <input {...getInputProps()} />
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export const UploadButton = ({
  isSubscribed,
  hasApiKeys,
}: {
  isSubscribed: boolean;
  hasApiKeys: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { requireApiKeys } = useRequireApiKeys();

  return (
    <Dialog
      open={isOpen || isUploading}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}
    >
      <Button
        disabled={isOpen || isUploading}
        aria-disabled={isOpen || isUploading}
        onClick={() => {
          if (!requireApiKeys(hasApiKeys)) return;
          setIsOpen(true);
        }}
      >
        Upload PDF
      </Button>

      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Upload PDF</DialogTitle>
        </VisuallyHidden>

        <UploadDropzone
          isSubscribed={isSubscribed}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />
      </DialogContent>
    </Dialog>
  );
};
