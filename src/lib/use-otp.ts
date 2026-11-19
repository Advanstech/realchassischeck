'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type FormEvent } from 'react';
import { ApiRequestError } from '@/lib/api';
import { requestOtp, verifyOtp, type AuthSession, type OtpChallenge } from '@/lib/auth';
import { AUTH_QUERY_KEY } from '@/lib/use-auth';

type Channel = 'sms' | 'email';

/**
 * The OTP challenge state machine (ACC-03), shared by the sign-in page and the
 * onboarding wizard: request a code, count down expiry and resend, verify, and
 * hand the verified session to the caller. The API creates the account on the
 * first verified code, so sign-in and registration are the same flow.
 */
export function useOtp(onVerified: (session: AuthSession) => void) {
  const t = useTranslations('auth');
  const queryClient = useQueryClient();

  const [channel, setChannelState] = useState<Channel>('sms');
  const [contact, setContactState] = useState('');
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [resendOverride, setResendOverride] = useState<number | null>(null);

  const request = useMutation({
    mutationFn: () => requestOtp({ channel, contact: contact.trim() }),
    onSuccess: (data) => {
      setChallenge(data);
      setSentAt(Date.now());
      setNow(Date.now());
      setResendOverride(null);
      setCode('');
      setError(null);
    },
    onError: (mutationError) => {
      if (mutationError instanceof ApiRequestError) {
        setError(mutationError.message);
        const retry = mutationError.body.details?.retryAfterSeconds;
        if (typeof retry === 'number') setResendOverride(retry);
      } else {
        setError(t('errorGeneric'));
      }
    },
  });

  const verify = useMutation({
    mutationFn: () => verifyOtp({ channel, contact: contact.trim(), code }),
    onSuccess: (session) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, session.user);
      onVerified(session);
    },
    onError: (mutationError) => {
      if (mutationError instanceof ApiRequestError) {
        const remaining = mutationError.body.details?.attemptsRemaining;
        setError(
          typeof remaining === 'number'
            ? `${mutationError.message} ${t('attemptsRemaining', { count: remaining })}`
            : mutationError.message,
        );
        if (mutationError.body.code === 'OTP_EXPIRED' || mutationError.body.code === 'OTP_LOCKED') {
          setChallenge(null);
          setCode('');
        }
      } else {
        setError(t('errorGeneric'));
      }
    },
  });

  useEffect(() => {
    if (!challenge) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [challenge]);

  const elapsed = sentAt === null ? 0 : Math.max(0, Math.floor((now - sentAt) / 1000));
  const resendIn = resendOverride ?? (challenge ? Math.max(0, challenge.resendAfterSeconds - elapsed) : 0);
  const expiresIn = challenge ? Math.max(0, challenge.expiresInSeconds - elapsed) : 0;

  return {
    channel,
    setChannel: (value: Channel) => {
      setChannelState(value);
      setError(null);
    },
    contact,
    setContact: (value: string) => {
      setContactState(value);
      setError(null);
    },
    code,
    setCode: (value: string) => {
      setCode(value.replace(/\D/g, '').slice(0, 6));
      setError(null);
    },
    challenge,
    error,
    resendIn,
    minutes: Math.floor(expiresIn / 60),
    seconds: expiresIn % 60,
    isSending: request.isPending,
    isVerifying: verify.isPending,
    sendCode: (event: FormEvent) => {
      event.preventDefault();
      if (!contact.trim()) return;
      setError(null);
      request.mutate();
    },
    resend: () => request.mutate(),
    submitCode: (event: FormEvent) => {
      event.preventDefault();
      if (code.length !== 6) return;
      setError(null);
      verify.mutate();
    },
    resetContact: () => {
      setChallenge(null);
      setCode('');
      setError(null);
      setSentAt(null);
      setResendOverride(null);
    },
  };
}