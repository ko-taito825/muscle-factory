import { getAuthenticatedDbUserId } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const userId = await getAuthenticatedDbUserId(request);
    if (!userId) {
      return NextResponse.json({ isNewUser: true });
    }

    const routineCount = await prisma.routine.count({
      where: { userId: userId },
    });

    const logCount = await prisma.workoutLog.count({
      where: { userId: userId },
    });

    const isNewUser = routineCount === 0 && logCount === 0;
    return NextResponse.json({ isNewUser });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ isNewUser: false });
  }
};
