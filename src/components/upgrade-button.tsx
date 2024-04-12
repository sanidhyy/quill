import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export const UpgradeButton = () => {
  return (
    <Button className="w-full">
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};
