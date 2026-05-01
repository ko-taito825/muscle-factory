import { prisma } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
const schema = z.object({
  supabaseUserId: z.string(),
});
export const POST = async (request: NextRequest) => {
  try {
    const body = schema.parse(await request.json());

    const user = await prisma.user.upsert({
      where: { supabaseUserId: body.supabaseUserId },
      update: {},
      create: {
        supabaseUserId: body.supabaseUserId,
      },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("ユーザー登録エラー", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "バリデーションエラー" },
        { status: 400 },
      );
    }
    return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
  }
};
