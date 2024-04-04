import { useRouter, useSearchParams } from "next/navigation";

const AuthCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");
};

export default AuthCallbackPage;
