import { getAuthenticatedDbUserId } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";

//「特定のルーティン専用のフィルター」特定のルーティンの過去の記録を全部欲しい時に使う
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const userId = await getAuthenticatedDbUserId(request);
  if (!userId)
    return NextResponse.json({ status: "認証に失敗しました" }, { status: 401 });
  const { id } = params;
  const isRoutineMode = request.nextUrl.searchParams.get("mode") === "routine";
  try {
    const workoutLog = await prisma.workoutLog.findFirst({
      where: isRoutineMode
        ? { routineId: parseInt(id), userId }
        : { id: parseInt(id), userId },
      orderBy: { createdAt: "desc" },
      include: {
        trainings: {
          include: {
            sets: true,
          },
        },
      },
    });
    return NextResponse.json({ routine: workoutLog }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
