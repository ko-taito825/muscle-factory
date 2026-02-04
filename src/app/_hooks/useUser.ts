import { supabase } from "@/utils/supabase";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUserId(user?.id || null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);
  return { userId, isLoading };
};
