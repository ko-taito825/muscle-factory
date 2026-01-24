import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setToken(session?.access_token || null);
      setIsLoading(false);

      const publicPaths = ["/signin", "/signup", "/password"];
      const isPulicPath = publicPaths.includes(pathname);

      if (!session) {
        if (!isPulicPath) {
          router.replace(`/signin?next=${pathname}`);
        }
      } else {
        if (isPulicPath) {
          router.replace("/");
        }
      }
    };
    fetcher();
  }, [pathname, router]);
  return { session, token, isLoading };
};
