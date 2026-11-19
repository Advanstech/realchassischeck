'use client';

import { ArrowRight, KeyRound, Mail, RefreshCw, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Banner, Chip } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';
import { useOtp } from '@/lib/use-otp';
import type { AuthSession } from '@/lib/auth';

const CHANNELS = [
  { value: 'sms', icon: Smartphone },
  { value: 'email', icon: Mail },
] as const;

/** Contact + code forms (ACC-03), shared by sign-in and the onboarding wizard. */
export function OtpForm({ onVerified }: { readonly onVerified: (session: AuthSession) => void }) {
  const t = useTranslations('auth');
  const otp = useOtp(onVerified);

  if (!otp.challenge) {
    return (
      <form onSubmit={otp.sendCode} className="flex flex-col gap-6">
        <div>
          <p className="text-h3 font-bold text-brand">{t('channelLabel')}</p>
          <div role="group" aria-label={t('channelLabel')} className="mt-3 inline-flex rounded-lg border border-hairline bg-bg-subtle p-1">
            {CHANNELS.map(({ value, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => otp.setChannel(value)}
                aria-pressed={otp.channel === value}
                className={cn(
                  'flex min-h-11 items-center gap-2 rounded-md px-4 text-small font-semibold transition-colors duration-150',
                  otp.channel === value ? 'bg-surface text-brand shadow-e1' : 'text-text-muted hover:text-brand',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {t(value)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="auth-contact" className="text-small font-semibold text-text">
            {otp.channel === 'sms' ? t('phoneLabel') : t('emailLabel')}
          </label>
          <input
            id="auth-contact"
            type={otp.channel === 'sms' ? 'tel' : 'email'}
            inputMode={otp.channel === 'sms' ? 'tel' : 'email'}
            autoComplete={otp.channel === 'sms' ? 'tel' : 'email'}
            required
            value={otp.contact}
            onChange={(event) => otp.setContact(event.target.value)}
            placeholder={otp.channel === 'sms' ? t('phonePlaceholder') : t('emailPlaceholder')}
            className="h-12 w-full rounded-md border border-border-strong bg-surface px-3 text-body text-text placeholder:text-text-subtle hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
          />
        </div>

        {otp.error ? <Banner tone="danger" title={otp.error} /> : null}

        <Button type="submit" size="lg" loading={otp.isSending} className="w-full">
          {otp.isSending ? t('sending') : t('sendCode')}
          {otp.isSending ? null : <ArrowRight className="size-5" aria-hidden="true" />}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={otp.submitCode} className="flex flex-col gap-6">
      <div>
        <Chip tone="success" className="mb-3">
          <KeyRound className="size-3.5" aria-hidden="true" />
          {t('codeTitle')}
        </Chip>
        <p className="text-small text-text-muted">{t('codeSentTo', { contact: otp.challenge.contactHint })}</p>
        <p className="num mt-1 text-caption text-text-subtle" aria-live="polite">
          {t('expiresIn', { minutes: otp.minutes, seconds: otp.seconds })}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="auth-code" className="text-small font-semibold text-text">
          {t('codeLabel')}
        </label>
        <input
          id="auth-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          required
          value={otp.code}
          onChange={(event) => otp.setCode(event.target.value)}
          placeholder={t('codePlaceholder')}
          className="num h-14 w-full rounded-md border border-border-strong bg-surface text-center text-h2 font-bold tracking-[0.4em] text-text placeholder:text-text-subtle focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
        />
      </div>

      {otp.challenge.devCode ? (
        <div className="rounded-md border border-info/30 bg-info-bg p-3 text-info-ink" data-testid="mock-code" data-code={otp.challenge.devCode}>
          <p className="text-small font-semibold">{t('mockCode', { code: otp.challenge.devCode })}</p>
          <p className="mt-1 text-caption">{t('mockHint')}</p>
          <button
            type="button"
            onClick={() => otp.setCode(otp.challenge?.devCode ?? '')}
            className="mt-2 min-h-11 text-small font-semibold underline"
          >
            {t('useMockCode')}
          </button>
        </div>
      ) : null}

      {otp.error ? <Banner tone="danger" title={otp.error} /> : null}

      <Button type="submit" size="lg" loading={otp.isVerifying} disabled={otp.code.length !== 6} className="w-full">
        {otp.isVerifying ? t('verifying') : t('verify')}
        {otp.isVerifying ? null : <ArrowRight className="size-5" aria-hidden="true" />}
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="secondary" size="sm" loading={otp.isSending} disabled={otp.resendIn > 0} onClick={otp.resend}>
          <RefreshCw className="size-4" aria-hidden="true" />
          {otp.resendIn > 0 ? t('resendIn', { seconds: otp.resendIn }) : t('resend')}
        </Button>
        <button type="button" onClick={otp.resetContact} className="min-h-11 text-small font-semibold text-link underline">
          {t('changeContact')}
        </button>
      </div>
    </form>
  );
}