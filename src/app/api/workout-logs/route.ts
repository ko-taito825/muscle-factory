import { prisma } from "@/app/_lib/prisma";
import { workoutLogRequset } from "@/app/_types/WorkoutLog";
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
    return NextResponse.json({ message: "認証失敗" }, { status: 400 });
  try {
    const body: workoutLogRequset = await request.json();
    const data = await prisma.workoutLog.create({
      data: {
        title: body.title,
        userId: dbUserId,
        routineId: body.routineId,
        trainingLogs: {
          create: body.trainingLogs.map((training) => ({
            name: training.name,
            orderIndex: training.orderIndex,
            setLogs: {
              create: training.setLogs.map((set) => ({
                weight: set.weight,
                reps: set.reps,
                orderIndex: set.orderIndex,
              })),
            },
          })),
        },
      },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "取得に失敗しました" },
      { status: 500 },
    );
  }
};

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
      console.log(`取得件数:${summaryLogs.length}件`);
      return NextResponse.json(summaryLogs, { status: 200 });
    }
    const fullLogs = await prisma.workoutLog.findMany({
      where: {
        userId: dbUserId,
      },
      include: {
        trainingLogs: {
          include: { setLogs: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(fullLogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "取得失敗" }, { status: 500 });
  }
};
