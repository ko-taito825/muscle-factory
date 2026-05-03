import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);

      const publicPaths = ["/signin", "/signup", "/password"];
      const isPublicPath = publicPaths.includes(pathname);

      if (!session) {
        if (!isPublicPath) {
          router.replace(`/signin?next=${pathname}`);
        }
      } else {
        if (isPublicPath) {
          router.replace("/");
        }
      }
    };
    fetcher();
  }, [pathname, router]);
  return { session, token: session?.access_token ?? null, isLoading };
  //sessionがあったらtokenを返す。sessionがないならnullを返す
};
