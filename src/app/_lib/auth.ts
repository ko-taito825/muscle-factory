import { supabase } from "@/utils/supabase";
import { prisma } from "./prisma";

export async function getAuthenticatedDbUserId(
  token: string,
): Promise<number | null> {
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
