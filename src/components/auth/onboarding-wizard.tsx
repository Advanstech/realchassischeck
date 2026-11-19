'use client';

import { ArrowLeft, ArrowRight, BadgeCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { OtpForm } from '@/components/auth/otp-form';
import { WizardDone } from '@/components/auth/wizard-done';
import { WizardIntent } from '@/components/auth/wizard-intent';
import { WizardProfile } from '@/components/auth/wizard-profile';
import { WizardStation, type StationState } from '@/components/auth/wizard-station';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/primitives';
import { safeNextPath, type AuthAccount } from '@/lib/auth';
import { AUTH_QUERY_KEY, useAuth } from '@/lib/use-auth';
import { useQueryClient } from '@tanstack/react-query';

const STEP_KEYS = ['verify', 'intent', 'profile', 'done'] as const;

/** Where a returning buyer resumes: the first station the server has no answer for. */
function resumeStep(account: AuthAccount | null): number {
  if (!account) return 0;
  if (!account.intent) return 1;
  if (!account.name) return 2;
  return 3;
}

/**
 * Guided registration and setup (ACC-05, SRS 2.3) as a left-to-right line:
 * verify → intent → details → ready. Each answer is stamped to the server as it
 * is given, the open station travels right, and a buyer can leave and resume.
 */
export function OnboardingWizard({ next }: { readonly next: string }) {
  const { account, isPending } = useAuth();

  if (isPending) {
    return (
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="panel-raised h-96 animate-pulse bg-bg-subtle" aria-hidden="true" />
      </section>
    );
  }

  return <WizardBody key={account?.id ?? 'anonymous'} account={account} next={safeNextPath(next)} />;
}

function WizardBody({
  account,
  next,
}: {
  readonly account: AuthAccount | null;
  readonly next: string;
}) {
  const t = useTranslations('wizard');
  const queryClient = useQueryClient();
  const [step, setStep] = useState(() => resumeStep(account));
  const [direction, setDirection] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const prevStep = useRef(step);
  const reduced = useReducedMotion();

  const total = STEP_KEYS.length;
  const contact = account?.phone ?? account?.email ?? t('journey.verified');

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
    if (prevStep.current !== step) {
      prevStep.current = step;
      trackRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
  }, [step, reduced]);

  function go(target: number) {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  }

  function saved(profile: AuthAccount) {
    queryClient.setQueryData(AUTH_QUERY_KEY, profile);
    go(step + 1);
  }

  const labels = [t('steps.verify'), t('steps.intent'), t('steps.profile'), t('journey.doneLabel')];
  const summaries = [contact, account?.intent ? t(`intent.options.${account.intent}.title`) : '', account?.name ?? ''];
  const hints = ['', t('journey.hints.intent'), t('journey.hints.profile'), t('journey.hints.done')];
  const stateLabels = [t('journey.stateDone'), t('journey.stateActive'), t('journey.stateTodo')];

  function stationContent(index: number) {
    if (index === 0) {
      return account ? (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-h2 font-extrabold text-brand">{t('journey.verifiedTitle')}</h2>
            <p className="mt-2 max-w-[52ch] text-body text-text-muted">{t('journey.verifiedNote', { contact })}</p>
          </div>
          <Button size="lg" className="self-start" onClick={() => go(Math.max(1, resumeStep(account)))}>
            {t('journey.continue')}
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-h2 font-extrabold text-brand">{t('verify.title')}</h2>
            <p className="mt-2 max-w-[52ch] text-body text-text-muted">{t('verify.lede')}</p>
          </div>
          <OtpForm
            onVerified={(session) => {
              queryClient.setQueryData(AUTH_QUERY_KEY, session.user);
              go(Math.max(1, resumeStep(session.user)));
            }}
          />
        </div>
      );
    }
    if (index === 1 && account) return <WizardIntent account={account} onSaved={saved} />;
    if (index === 2 && account) return <WizardProfile account={account} onSaved={saved} />;
    if (index === 3 && account) return <WizardDone account={account} next={next} />;
    return null;
  }

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="mt-3 text-h1 font-extrabold tracking-tight text-brand">{t('journey.title')}</h1>
        </div>
        <p className="max-w-[36ch] text-caption text-text-subtle sm:text-right">{t('savedNote')}</p>
      </div>

      <ol
        ref={trackRef}
        aria-label={t('journey.trackLabel')}
        className="relative mt-10 grid scroll-mt-24 grid-cols-4 gap-x-2 lg:flex lg:items-stretch lg:gap-4"
      >
        {STEP_KEYS.map((key, index) => {
          const state: StationState = index < step ? 'done' : index === step ? 'active' : 'todo';
          return (
            <WizardStation
              key={key}
              index={index}
              label={labels[index] ?? key}
              state={state}
              stateLabel={stateLabels[state === 'done' ? 0 : state === 'active' ? 1 : 2] ?? ''}
              last={index === total - 1}
              slide={direction * 24}
              visitLabel={
                state === 'done'
                  ? t('journey.visitDone', { label: labels[index] ?? key })
                  : state === 'active'
                    ? t('journey.visitActive', { label: labels[index] ?? key })
                    : t('journey.visitTodo', { label: labels[index] ?? key })
              }
              onVisit={() => {
                if (state === 'done') go(index);
                else panelRef.current?.focus({ preventScroll: true });
              }}
              summary={summaries[index]}
              hint={hints[index]}
              editLabel={t('journey.edit')}
              onEdit={() => go(index)}
              panelRef={panelRef}
            >
              {stationContent(index)}
            </WizardStation>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {step > 0 && step < total - 1 ? (
          <button
            type="button"
            onClick={() => go(step - 1)}
            className="flex min-h-11 items-center gap-1.5 text-small font-semibold text-link"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t('back')}
          </button>
        ) : (
          <span />
        )}
        <p className="flex items-center gap-1.5 text-caption text-text-subtle" aria-live="polite">
          {step >= total - 1 ? (
            <>
              <BadgeCheck className="size-4 text-success" aria-hidden="true" />
              {t('allDone')}
            </>
          ) : (
            t('stepOf', { current: step + 1, total: total - 1 })
          )}
        </p>
      </div>
    </section>
  );
}