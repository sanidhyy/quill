"use client";

import { type Dispatch, type SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/app/_trpc/client";

type DeleteFileModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentlyDeletingFile: { id: string; name: string } | null;
  setCurrentlyDeletingFile: Dispatch<
    SetStateAction<{
      id: string;
      name: string;
    } | null>
  >;
};

export const DeleteFileModal = ({
  isOpen,
  setIsOpen,
  currentlyDeletingFile,
  setCurrentlyDeletingFile,
}: DeleteFileModalProps) => {
  const utils = trpc.useUtils();

  const { mutate: deleteFile, isPending } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onSettled: () => setCurrentlyDeletingFile(null),
  });

  const onClose = () => setIsOpen(false);

  const onClick = () => {
    if (!currentlyDeletingFile) return;

    deleteFile({ id: currentlyDeletingFile.id });

    onClose();
  };

  return (
    <Dialog
      open={isOpen || isPending}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}
    >
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete File
          </DialogTitle>

          <DialogDescription className="text-center">
            Are you sure you want to do this? <br />
            The file <strong>{currentlyDeletingFile?.name || ""}</strong> will
            be will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100/90 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isPending}
              aria-disabled={isPending}
              onClick={onClose}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              aria-disabled={isPending}
              onClick={onClick}
              variant="danger"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
