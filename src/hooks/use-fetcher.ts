/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import useSWR from "swr";

export type repositoryFetcher<T> = (url: string) => T;
export type dispatcher<K> = (data: K) => void;

type fetcher = <T, K>(
  url: string,
  repositoryFetcher: repositoryFetcher<T>,
  dispatcher?: dispatcher<K>
) => fetcherReturn;

interface fetcherReturn {
  data: unknown;
  isLoading: boolean;
  error: unknown;
}

export const useFetcher: fetcher = (url, repositoryFetcher, dispatcher) => {
  const resolveFetcher = (url: string) => repositoryFetcher(url);

  const onSuccessDispatcher = useCallback(
    (data: any) => {
      if (!dispatcher || !data) return;
      dispatcher(data);
    },
    [dispatcher]
  );

  const { data, error, isLoading } = useSWR(url, resolveFetcher, {
    revalidateOnFocus: false,
    onSuccess: onSuccessDispatcher,
  });

  return { data, isLoading, error };
};
