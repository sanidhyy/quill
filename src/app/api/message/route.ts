import { db } from "@/db";
import { sendMessageValidator } from "@/lib/validators/send-message-validator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // endpoint for asking a question to a PDF file

  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) return new NextResponse("Unauthorized.", { status: 401 });

  const { id: userId } = user;

  const { fileId, message } = sendMessageValidator.parse(body);

  const file = await db.file.findUnique({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) return new NextResponse("Not Found.", { status: 404 });

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });
}
