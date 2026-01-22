import { prisma } from "@/app/_lib/prisma";
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

//「特定のルーティン専用のフィルター」特定のルーティンの過去の記録を全部欲しい時に使う
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const token = request.headers.get("Authorization") ?? "";
  const dbUserId = await getAuthenticatedDbUserId(token);
  if (!dbUserId)
    return NextResponse.json({ status: "認証に失敗しました" }, { status: 401 });
  const { id } = params;
  const isRoutineMode = request.nextUrl.searchParams.get("mode") === "routine";
  try {
    const workoutLog = await prisma.workoutLog.findFirst({
      where: isRoutineMode
        ? { routineId: parseInt(id), userId: dbUserId }
        : { id: parseInt(id), userId: dbUserId },
      orderBy: { createdAt: "desc" },
      include: {
        trainings: {
          include: {
            sets: true,
          },
        },
      },
    });
    if (!workoutLog) {
      return NextResponse.json({ routine: null }, { status: 200 });
    }
    return NextResponse.json({ routine: workoutLog }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
