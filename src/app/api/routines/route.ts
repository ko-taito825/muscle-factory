import { getAuthenticatedDbUserId } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { Routines } from "@/app/_types/Routines";
import { NextRequest, NextResponse } from "next/server";

//新規ルーティン名の登録(POST)
export const POST = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";

  const dbUserId = await getAuthenticatedDbUserId(token);
  if (dbUserId === null)
    return NextResponse.json(
      { message: "ユーザー認証に失敗したか、DBにユーザーがいません" },
      { status: 401 },
    );
  try {
    const { title } = await request.json();
    const newRoutine = await prisma.routine.create({
      data: {
        title,
        userId: dbUserId,
      },
    });

    return NextResponse.json<Routines>(newRoutine, { status: 201 });
  } catch (error) {
    console.error("DEBUG: POST /api/routines error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: unknown }).code === "P2002"
    ) {
      //dbの@@uniqueのやつ同じユーザーが「胸の日」という名前を2回使おうとするとPrismaはP2002をつけてエラーを投げる
      return NextResponse.json(
        {
          message: "その名前のルーティンはすでに存在します",
        },
        { status: 400 },
      );
    }

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
  const token = request.headers.get("Authorization") ?? "";
  const dbUserId = await getAuthenticatedDbUserId(token);

  if (dbUserId === null)
    return NextResponse.json(
      { message: "認証に失敗しました" },
      { status: 401 },
    );

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");
  try {
    if (mode === "summary") {
      const summaryRoutines = await prisma.routine.findMany({
        where: { userId: dbUserId },
        select: { id: true, title: true, createdAt: true },
        orderBy: { updatedAt: "desc" },
      });
      return NextResponse.json(summaryRoutines, { status: 200 });
    }

    //新しい仕様、Routine -> WorkoutLog (最新1件) -> Training -> Set と辿る
    const routineWithTemplate = await prisma.routine.findMany({
      where: { userId: dbUserId },
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
    return NextResponse.json(
      { message: "取得に失敗しました" },
      { status: 500 },
    );
  }
};
