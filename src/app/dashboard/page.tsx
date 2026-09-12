import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

import { Dashboard } from "@/components/dashboard";
import { db } from "@/db";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { hasUserApiKeys } from "@/lib/user-api-keys";

const DashboardPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  const subscriptionPlan = await getUserSubscriptionPlan();
  const hasApiKeys = await hasUserApiKeys();

  return (
    <Dashboard subscriptionPlan={subscriptionPlan} hasApiKeys={hasApiKeys} />
  );
};

export default DashboardPage;
