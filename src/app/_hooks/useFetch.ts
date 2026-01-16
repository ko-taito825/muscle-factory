import useSWR from "swr";
import { useSupabaseSession } from "./useSupabaseSession";

export const useFetch = <T>(url: string | null) => {
  const { token } = useSupabaseSession();

  // どこで止まっているかコンソールに出す
  console.log(" useFetchの状態 - url:", url, " tokenがあるか:", !!token);

  const fetcher = async ([url, token]: [string, string]) => {
    console.log("fetcher開始:", url);
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("APIエラー:", errorData);
      throw new Error("データの取得に失敗しました");
    }

    const json = await res.json();
    console.log("APIから届いたデータ:", json);
    return json as T;
  };

  const { data, error, isLoading } = useSWR<T>(
    // url と token が両方揃った時だけ実行する
    url && token ? [url, token] : null,
    fetcher,
  );

  return { data, error, isLoading };
};
