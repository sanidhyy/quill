"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { API_KEYS_REQUIRED_MESSAGE } from "@/config/api-keys";

export function useRequireApiKeys() {
  const router = useRouter();

  const showApiKeysRequiredToast = (
    message = API_KEYS_REQUIRED_MESSAGE,
  ) => {
    toast.error(message, {
      action: {
        label: "Settings",
        onClick: () => router.push("/dashboard/settings"),
      },
    });
  };

  const requireApiKeys = (hasApiKeys: boolean) => {
    if (hasApiKeys) {
      return true;
    }

    showApiKeysRequiredToast();
    return false;
  };

  return { requireApiKeys, showApiKeysRequiredToast };
}
