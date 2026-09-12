import { ApiKeysForm } from "@/components/api-keys-form";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserApiKeys } from "@/lib/user-api-keys";

const SettingsPage = async () => {
  const apiKeys = await getUserApiKeys();

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <div className="mt-12 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Settings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your AI provider credentials for PDF chat.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Provide your own OpenAI and Pinecone credentials to upload PDFs
              and chat. Keys are stored encrypted in your browser and expire
              after 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApiKeysForm
              initialValues={{
                openaiApiKey: apiKeys?.openaiApiKey ?? "",
                pineconeApiKey: apiKeys?.pineconeApiKey ?? "",
                pineconeIndex: apiKeys?.pineconeIndex ?? "",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
};

export default SettingsPage;
