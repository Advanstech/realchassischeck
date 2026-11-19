'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiRequestError } from './api';
import { fetchMe, hasSessionHint, refreshSession, signOut, signOutAll, type AuthAccount } from './auth';

export const AUTH_QUERY_KEY = ['auth', 'session'] as const;

/**
 * The header and account page share one session query. Signed-out visitors (no
 * readable hint cookie) resolve to null without a request, so public pages log
 * no 401s. A 401 from `/me` tries a single refresh rotation; if that fails the
 * visitor is signed out, not stuck in a retry loop. The API clears dead cookies
 * on a failed rotation.
 */
async function loadSession(signal: AbortSignal): Promise<AuthAccount | null> {
  if (!hasSessionHint()) return null;
  try {
    return await fetchMe(signal);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      try {
        const session = await refreshSession(signal);
        return session.user;
      } catch {
        return null;
      }
    }
    throw error;
  }
}

export function useAuth() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: ({ signal }) => loadSession(signal),
    retry: false,
    staleTime: 30_000,
  });

  const out = useMutation({
    mutationFn: signOut,
    onSuccess: () => queryClient.setQueryData(AUTH_QUERY_KEY, null),
  });
  const all = useMutation({
    mutationFn: signOutAll,
    onSuccess: () => queryClient.setQueryData(AUTH_QUERY_KEY, null),
  });

  return {
    account: query.data ?? null,
    isPending: query.isPending,
    isError: query.isError,
    signOut: out.mutateAsync,
    signOutAll: all.mutateAsync,
    isSigningOut: out.isPending || all.isPending,
  };
}
