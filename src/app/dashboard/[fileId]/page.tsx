import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

import { db } from "@/db";
import { FileIdClient } from "./client";

const FileIdPage = async (props: { params: Promise<{ fileId: string }> }) => {
  const params = await props.params;
  // retrieve file id
  const { fileId } = params;

  // authenticate user
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  // get file details
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <FileIdClient
      fileId={fileId}
      fileUrl={file.url.replace(/^http:\/\//i, "https://")}
    />
  );
};

export default FileIdPage;
