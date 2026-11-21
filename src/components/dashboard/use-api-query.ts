"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, apiRequest } from "@/lib/api-client";

type QueryState<T> = { data: T | undefined; error: ApiError | undefined; isLoading: boolean };

/**
 * Loads `path` from the API with the signed-in user's token. Keeps the previous data while reloading,
 * so lists don't flash empty after an action. Call `reload()` after a change.
 */
export function useApiQuery<T>(path: string) {
  const [state, setState] = useState<QueryState<T>>({ data: undefined, error: undefined, isLoading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiRequest<T>(path)
      .then((data) => {
        if (!cancelled) setState({ data, error: undefined, isLoading: false });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const apiError = error instanceof ApiError ? error : new ApiError(0, "UNKNOWN", "Something went wrong. Please try again.");
        setState((current) => ({ data: current.data, error: apiError, isLoading: false }));
      });
    return () => {
      cancelled = true;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);
  return { ...state, reload };
}
