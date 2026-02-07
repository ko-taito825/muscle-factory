//routines/[id]で「UXは更新（PUT）のように見せて、裏側のデータ（DB）は履歴（POST）として積み上げている」設計のAPIを書く

import { getAuthenticatedDbUserId } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { RoutineDetail } from "@/app/_types/RoutineDetail";
import { RoutineFormValues } from "@/app/_types/RoutineValue";
import { NextRequest, NextResponse } from "next/server";

//選択されたルーティンの「前回の内容」を取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const userId = await getAuthenticatedDbUserId(request);
  if (!userId)
    return NextResponse.json({ message: "認証失敗" }, { status: 401 });

  const { id } = params;
  try {
    const routine = await prisma.routine.findUnique({
      where: {
        id: parseInt(id),
        userId,
      },
      include: {
        workoutLogs: {
          where: { userId },
          //最新のworkoutLogsを一件だけ取得して、それを今回のトレーニングの雛形にする
          orderBy: { date: "desc" },
          take: 1,
          include: {
            trainings: {
              include: {
                sets: true,
              },
            },
          },
        },
      },
    });
    if (!routine) {
      return NextResponse.json(
        { status: "ルーティンが見つかりません" },
        { status: 404 },
      );
    }
    return NextResponse.json<RoutineDetail>(routine, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "取得に失敗しました" },
      { status: 500 },
    );
  }
};

//PUT

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const userId = await getAuthenticatedDbUserId(request);
  if (!userId)
    return NextResponse.json({ message: "認証失敗" }, { status: 401 });

  const { id } = params;
  const body: RoutineFormValues = await request.json();
  const { title } = body; //更新するのはタイトルのみ

  try {
    const updateRoutine = await prisma.routine.update({
      where: {
        id: parseInt(id),
        userId,
      },
      data: {
        title,
      },
    });
    return NextResponse.json(updateRoutine, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const userId = await getAuthenticatedDbUserId(request);
  if (!userId)
    return NextResponse.json({ message: "認証失敗" }, { status: 401 });
  const { id } = params;
  try {
    await prisma.routine.delete({
      where: {
        id: parseInt(id),
        userId,
      },
    });
    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
