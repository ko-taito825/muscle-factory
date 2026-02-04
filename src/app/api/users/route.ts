import { prisma } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { supabaseUserId } = body;

    if (!supabaseUserId) {
      return NextResponse.json(
        {
          message: "supabaseUserIdが必要です",
        },
        { status: 400 },
      );
    }
    const user = await prisma.user.upsert({
      where: { supabaseUserId },
      update: {},
      create: {
        supabaseUserId,
      },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("ユーザー登録エラー", error);
    return NextResponse.json(
      { message: "サーバー内部でエラーが発生しました" },
      { status: 500 },
    );
  }
};
