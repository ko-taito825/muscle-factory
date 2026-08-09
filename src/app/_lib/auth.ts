import { supabase } from "@/utils/supabase";
import { prisma } from "./prisma";
import { NextRequest } from "next/server";

export async function getAuthenticatedDbUserId(
  request: NextRequest,
): Promise<number | null> {
  const authHeader = request.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/bearer /i, "").trim();
  if (!token) {
    return null;
  }
  try {
    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims) return null;
    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: data.claims.sub },
    });
    return dbUser ? dbUser.id : null;
  } catch (error) {
    console.error("Auth Utility Error:", error);
    return null;
  }
}
