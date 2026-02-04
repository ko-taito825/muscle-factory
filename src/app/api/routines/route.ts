import { getAuthenticatedDbUserId } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { Routines } from "@/app/_types/Routines";
import { NextRequest, NextResponse } from "next/server";

//新規ルーティン名の登録(POST)
export const POST = async (request: NextRequest) => {
  const userId = await getAuthenticatedDbUserId(request);
  if (userId === null)
    return NextResponse.json(
      { message: "ユーザー認証に失敗したか、DBにユーザーがいません" },
      { status: 401 },
    );
  try {
    const { title } = await request.json();
    const existRoutine = await prisma.routine.findFirst({
      where: { title, userId },
    });
    if (existRoutine) {
      return NextResponse.json(
        { message: "そのルーティン名はすでに存在します" },
        { status: 400 },
      );
    }
    const newRoutine = await prisma.routine.create({
      data: {
        title,
        userId,
      },
    });

    return NextResponse.json<Routines>(newRoutine, { status: 201 });
  } catch (error) {
    console.error("DEBUG: POST /api/routines error:", error);
    return NextResponse.json(
      {
        message: "Routineの作成に失敗しました",
      },
      { status: 500 },
    );
  }
};

//get書いて登録したルーティンを取得する.
export const GET = async (request: NextRequest) => {
  const userId = await getAuthenticatedDbUserId(request);

  if (userId === null)
    return NextResponse.json(
      { message: "認証に失敗しました" },
      { status: 401 },
    );

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");
  try {
    if (mode === "summary") {
      const summaryRoutines = await prisma.routine.findMany({
        where: { userId },
        select: { id: true, title: true, createdAt: true },
        orderBy: { updatedAt: "desc" },
      });
      return NextResponse.json(summaryRoutines, { status: 200 });
    }

    //新しい仕様、Routine -> WorkoutLog (最新1件) -> Training -> Set と辿る
    const routineWithTemplate = await prisma.routine.findMany({
      where: { userId },
      include: {
        workoutLogs: {
          orderBy: { date: "desc" }, //最新のログの取得
          take: 1, //一件だけの取得
          include: {
            trainings: {
              include: {
                sets: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json<Routines[]>(routineWithTemplate, { status: 200 });
  } catch (error) {
    console.error("API ERROR DETAILS:", error);
    return NextResponse.json(
      { message: "取得に失敗しました" },
      { status: 500 },
    );
  }
};
