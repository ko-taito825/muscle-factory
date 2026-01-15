import { prisma } from "@/app/_lib/prisma";
import { Routines } from "@/app/_types/Routines";
import { RoutineFormValues } from "@/app/_types/RoutineValue";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

async function getAuthenticatedDbUserId(token: string) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  // upsert
  const dbUser = await prisma.user.upsert({
    where: {
      supabaseUserId: user.id,
    },
    update: {},
    create: {
      supabaseUserId: user.id,
    },
  });

  return dbUser.id;
}

export const POST = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";
  const dbUserId = await getAuthenticatedDbUserId(token);
  if (dbUserId === null)
    return NextResponse.json(
      { message: "ユーザー認証に失敗したか、DBにユーザーがいません" },
      { status: 401 }
    );
  try {
    const body: RoutineFormValues = await request.json();
    console.log("body", body);
    const { title, trainings } = body;
    const data = await prisma.routine.create({
      data: {
        title: title,
        userId: dbUserId,
        trainings: {
          create: body.trainings.map((training) => ({
            title: training.title,
            sets: {
              create: training.sets.map((set) => ({
                weight: parseFloat(set.weight) || 0,
                reps: parseInt(set.reps, 10) || 0,
              })),
            },
          })),
        },
      },
    });
    return NextResponse.json<Routines>(data, { status: 201 });
  } catch (error: any) {
    console.error("エラー", error);
    return NextResponse.json(
      {
        message: "Routineの作成に失敗しました",
        detail: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
};

//get書いて登録したルーティンを取得する.
export const GET = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";
  const dbUserId = await getAuthenticatedDbUserId(token);
  if (dbUserId === null)
    return NextResponse.json(
      { message: "ログインが必要です" },
      { status: 400 }
    );
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");
  try {
    if (mode === "summary") {
      const summaryRoutines = await prisma.routine.findMany({
        where: { userId: dbUserId },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json<Routines[]>(summaryRoutines, { status: 200 });
    }
    const fullsRoutines = await prisma.routine.findMany({
      where: { userId: dbUserId },
      include: { trainings: { include: { sets: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json<Routines[]>(fullsRoutines, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "取得に失敗しました" },
      { status: 500 }
    );
  }
};
