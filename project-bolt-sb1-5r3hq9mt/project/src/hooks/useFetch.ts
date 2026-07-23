import { useEffect, useState } from 'react';

export function useFetch<T>(
  fetcher: () => Promise<{ data: T | null; error: string | null }>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetcher().then(({ data, error }) => {
      if (!active) return;
      setData(data);
      setError(error);
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, setData, setError };
}
