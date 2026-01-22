import { prisma } from "@/app/_lib/prisma";
import { Routines } from "@/app/_types/Routines";
import { workoutLogRequset } from "@/app/_types/WorkoutLog";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

async function getAuthenticatedDbUserId(token: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  const dbUser = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
  });
  return dbUser ? dbUser.id : null;
}
//カレンダーに表示するために全ての日付ログを取得する
export const GET = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";
  const dbUserId = await getAuthenticatedDbUserId(token);

  console.log("取得したユーザーID:", dbUserId);

  if (dbUserId === null)
    return NextResponse.json(
      { message: "ユーザー認証に失敗したか、DBにユーザーいません" },
      { status: 401 },
    );
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");
  try {
    if (mode === "summary") {
      const summaryLogs = await prisma.workoutLog.findMany({
        where: { userId: dbUserId },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json<Routines[]>(summaryLogs, { status: 200 });
    }
    const fullLogs = await prisma.workoutLog.findMany({
      where: {
        userId: dbUserId,
      },
      include: {
        trainings: {
          include: { sets: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(fullLogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "取得失敗" }, { status: 500 });
  }
};
