import { BillingForm } from "@/components/billing-form";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const BillingPage = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return <BillingForm subscriptionPlan={subscriptionPlan} />;
};

export default BillingPage;
