import { getAuthenticatedDbUserId } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { Routines } from "@/app/_types/Routines";
import { workoutLogRequest } from "@/app/_types/WorkoutLog";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const userId = await getAuthenticatedDbUserId(request);
  if (userId === null)
    return NextResponse.json(
      { message: "ユーザー認証に失敗したか、DBにユーザーがいません" },
      { status: 401 },
    );
  try {
    const body: workoutLogRequest = await request.json();
    console.log("body", body);
    const { routineId, title, date, trainings } = body;
    const newLog = await prisma.workoutLog.create({
      //Nested Write
      data: {
        userId,
        routineId,
        title, //routine名のスナップショット
        date: date ? new Date(date) : new Date(),
        trainings: {
          create: trainings.map((training) => ({
            title: training.title,
            sets: {
              create: training.sets.map((set) => ({
                weight: set.weight,
                reps: set.reps,
              })),
            },
          })),
        },
      },
    });
    return NextResponse.json<Routines>(newLog, { status: 201 });
  } catch (error) {
    console.error("エラー", error);
    return NextResponse.json(
      { message: "Routineの作成に失敗しました" },
      { status: 500 },
    );
  }
};

//workoutlog,training,setを登録するPOST（）
