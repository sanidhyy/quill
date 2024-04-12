"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";

const CHECKOUT_TOAST_ID = "checkout-toast";

export const UpgradeButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/dashboard/billing";
    },
    onSettled: () => setIsLoading(false),
  });

  const handleClick = () => {
    setIsLoading(true);
    toast.loading("Redirecting to checkout...", {
      description: "Please wait while we redirect you to checkout page.",
      id: CHECKOUT_TOAST_ID,
    });

    createStripeSession();
  };

  useEffect(() => {
    if (!isLoading) toast.dismiss(CHECKOUT_TOAST_ID);
  }, [isLoading]);

  return (
    <Button
      disabled={isLoading}
      aria-disabled={isLoading}
      className="w-full"
      onClick={handleClick}
    >
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};
