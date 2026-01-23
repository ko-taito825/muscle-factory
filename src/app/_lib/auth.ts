import { supabase } from "@/utils/supabase";
import { prisma } from "./prisma";
import { NextRequest } from "next/server";

export async function getAuthenticatedDbUserId(
  request: NextRequest,
): Promise<number | null> {
  const authHeader = request.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/bearer /i, "").trim();
  if (!token) return null;
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id },
    });
    return dbUser ? dbUser.id : null;
  } catch (error) {
    console.error("Auth Utility Error:", error);
    return null;
  }
}
