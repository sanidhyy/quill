"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2, Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  apiKeysFormSchema,
  type ApiKeysFormValues,
} from "@/lib/validators/api-keys-validator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type ApiKeysFormProps = {
  initialValues: ApiKeysFormValues;
};

type SecretFieldName = "openaiApiKey" | "pineconeApiKey";

const PINECONE_INDEX_STEPS = [
  "Open Pinecone and create a new index (any name, e.g. quill).",
  "Enable Custom settings.",
  "Set Vector type to Dense.",
  "Set Dimension to 1536.",
  "Set Metric to cosine.",
  "Keep Capacity mode as Serverless, then create the index.",
] as const;

export const ApiKeysForm = ({ initialValues }: ApiKeysFormProps) => {
  const router = useRouter();
  const [visibleFields, setVisibleFields] = useState<
    Record<SecretFieldName, boolean>
  >({
    openaiApiKey: false,
    pineconeApiKey: false,
  });
  const [isRemoving, setIsRemoving] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const form = useForm<ApiKeysFormValues>({
    resolver: zodResolver(apiKeysFormSchema),
    defaultValues: {
      openaiApiKey: initialValues.openaiApiKey ?? "",
      pineconeApiKey: initialValues.pineconeApiKey ?? "",
      pineconeIndex: initialValues.pineconeIndex ?? "",
    },
  });

  const isLoading = form.formState.isSubmitting || isRemoving;
  const hasSavedKeys = Object.values(initialValues).some(
    (value) => value.trim().length > 0,
  );

  const onSubmit = async (values: ApiKeysFormValues) => {
    try {
      const response = await fetch("/api/settings/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to save API keys.");
      }

      toast.success("API keys saved successfully.");
      router.refresh();
    } catch (error: unknown) {
      console.error("[API_KEYS_FORM]: ", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save API keys.",
      );
    }
  };

  const onRemove = async () => {
    try {
      setIsRemoving(true);
      const response = await fetch("/api/settings/api-keys", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove API keys.");
      }

      form.reset({
        openaiApiKey: "",
        pineconeApiKey: "",
        pineconeIndex: "",
      });
      setIsRemoveOpen(false);
      toast.success("API keys removed successfully.");
      router.refresh();
    } catch (error: unknown) {
      console.error("[API_KEYS_FORM_REMOVE]: ", error);
      toast.error("Failed to remove API keys.");
    } finally {
      setIsRemoving(false);
    }
  };

  const toggleVisibility = (field: SecretFieldName) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="openaiApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenAI API Key</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={visibleFields.openaiApiKey ? "text" : "password"}
                    autoComplete="off"
                    placeholder="sk-..."
                    disabled={isLoading}
                    className="pr-10"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleVisibility("openaiApiKey")}
                  >
                    {visibleFields.openaiApiKey ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Get your API key from{" "}
                <Link
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  OpenAI
                </Link>
                . Used for embeddings and chat.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pineconeApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pinecone API Key</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={visibleFields.pineconeApiKey ? "text" : "password"}
                    autoComplete="off"
                    placeholder="pcsk_..."
                    disabled={isLoading}
                    className="pr-10"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleVisibility("pineconeApiKey")}
                  >
                    {visibleFields.pineconeApiKey ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Get your API key from{" "}
                <Link
                  href="https://app.pinecone.io"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  Pinecone
                </Link>
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pineconeIndex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pinecone Index</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="quill"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Name of the Pinecone index that stores PDF embeddings.{" "}
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                      How to create an index?
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create a Pinecone index</DialogTitle>
                      <DialogDescription>
                        <VisuallyHidden>
                          Quill needs a dense index with 1536 dimensions and
                          cosine similarity for OpenAI embeddings.
                        </VisuallyHidden>
                      </DialogDescription>
                    </DialogHeader>

                    <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                      {PINECONE_INDEX_STEPS.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>

                    <div className="overflow-hidden rounded-md border bg-muted/30">
                      <Image
                        src="/pinecone-setup.png"
                        alt="Pinecone create index form with Custom settings, Dense vector type, dimension 1536, and cosine metric"
                        width={1280}
                        height={900}
                        className="h-auto w-full"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {hasSavedKeys ? (
            <>
              <Button
                type="button"
                variant="destructive"
                disabled={isLoading}
                aria-disabled={isLoading}
                onClick={() => setIsRemoveOpen(true)}
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Remove API Keys
              </Button>

              <Dialog
                open={isRemoveOpen || isRemoving}
                onOpenChange={(v) => {
                  if (!v && !isRemoving) setIsRemoveOpen(v);
                }}
              >
                <DialogContent className="p-0 overflow-hidden">
                  <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                      Remove API Keys
                    </DialogTitle>

                    <DialogDescription className="text-center">
                      Are you sure you want to do this? <br />
                      Upload and chat will stop working until you add your API
                      keys again.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="bg-gray-100/90 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                      <Button
                        type="button"
                        disabled={isRemoving}
                        aria-disabled={isRemoving}
                        onClick={() => setIsRemoveOpen(false)}
                        variant="ghost"
                        className="hover:bg-background"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        disabled={isRemoving}
                        aria-disabled={isRemoving}
                        onClick={onRemove}
                        variant="danger"
                      >
                        Confirm
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div />
          )}

          <Button type="submit" disabled={isLoading} aria-disabled={isLoading}>
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
