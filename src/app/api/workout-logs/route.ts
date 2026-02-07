import { getAuthenticatedDbUserId } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { Routines } from "@/app/_types/Routines";
import { NextRequest, NextResponse } from "next/server";

//カレンダーに表示するために全ての日付ログを取得する
export const GET = async (request: NextRequest) => {
  const userId = await getAuthenticatedDbUserId(request);

  if (userId === null)
    return NextResponse.json(
      { message: "ユーザー認証に失敗したか、DBにユーザーいません" },
      { status: 401 },
    );
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");
  try {
    if (mode === "summary") {
      const summaryLogs = await prisma.workoutLog.findMany({
        where: { userId },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json<Routines[]>(summaryLogs, { status: 200 });
    }
    const fullLogs = await prisma.workoutLog.findMany({
      where: {
        userId,
      },
      include: {
        trainings: {
          include: { sets: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(fullLogs, { status: 200 });
  } catch {
    return NextResponse.json({ message: "取得失敗" }, { status: 500 });
  }
};
