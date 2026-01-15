//GET
import { prisma } from "@/app/_lib/prisma";
import { Routines } from "@/app/_types/Routines";
import { RoutineFormValues } from "@/app/_types/RoutineValue";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  const { id } = params;
  try {
    const routine = await prisma.routine.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        trainings: {
          include: {
            sets: true,
          },
        },
      },
    });
    if (!routine) {
      return NextResponse.json(
        { status: "ルーティンが見つかりません" },
        { status: 404 }
      );
    }
    return NextResponse.json<{ routine: Routines }>(
      { routine: routine as Routines },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

//PUT

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  const { id } = params;
  const body: RoutineFormValues = await request.json();
  const { title, trainings } = body; //フロントから届くデータ

  try {
    const routine = await prisma.$transaction(async (tx) => {
      await tx.training.deleteMany({
        where: { routineId: parseInt(id) },
      });

      return await tx.routine.update({
        where: { id: parseInt(id) },
        data: {
          title: title,
          trainings: {
            create: trainings.map((training) => ({
              title: training.title,
              sets: {
                create: training.sets.map((set) => ({
                  weight: parseFloat(String(set.weight)) || 0,
                  reps: parseInt(String(set.reps)) || 0,
                })),
              },
            })),
          },
        },
        include: { trainings: { include: { sets: true } } },
      });
    });
    return NextResponse.json<Routines>(routine as Routines, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  const { id } = params;
  try {
    await prisma.routine.delete({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
