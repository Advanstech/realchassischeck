'use client';

import {
  CarFront,
  Check,
  CheckCircle2,
  FileText,
  Hand,
  QrCode,
  ScanLine,
  ShieldCheck,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

/** Decorative product story: the real instructions remain in the adjacent step copy. */
export function VinJourneyVisual({ active, compact = false }: { readonly active: number; readonly compact?: boolean }) {
  const t = useTranslations('how.visual');
  const reduce = useReducedMotion();
  const stages = t.raw('stages') as ReadonlyArray<string>;
  const tilt = active === 0 ? -1.5 : active === 1 ? 0 : 1.5;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'hero-canvas hero-grid relative isolate overflow-hidden rounded-sheet border border-white/10 text-on-inverse shadow-e4',
        compact ? 'min-h-80 p-4' : 'min-h-[34rem] p-6 sm:p-8',
      )}
    >
      <div className="relative z-10 flex items-center justify-between gap-4 text-caption font-semibold uppercase tracking-[0.14em] text-navy-200">
        <span className="flex items-center gap-2">
          <ScanLine className="size-4 text-red-300" />
          {t('demoLabel')}
        </span>
        <span className="num">0{active + 1} / 03</span>
      </div>

      <span className="pointer-events-none absolute -left-2 bottom-10 text-display-xl font-extrabold text-white opacity-[0.04]">
        0{active + 1}
      </span>
      <div className="aperture pointer-events-none absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className={cn('relative z-10 mx-auto', compact ? 'mt-5 max-w-60 pb-8' : 'mt-7 max-w-xs pb-10')}>
        <motion.div
          initial={{ rotate: tilt }}
          animate={{ rotate: tilt }}
          transition={{ duration: reduce ? 0 : 0.35 }}
          className="overflow-hidden rounded-xl border border-white/50 bg-surface text-text shadow-lift"
        >
          <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
            <span className="flex items-center gap-2 text-caption font-bold text-brand">
              <span className="grid size-5 place-items-center rounded-xs bg-brand text-caption text-on-brand">R</span>
              RCC
            </span>
            <span className="size-1.5 rounded-full bg-success" />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -12 }}
              transition={{ duration: reduce ? 0 : 0.3 }}
              className={cn('p-4', compact ? 'min-h-60' : 'min-h-80')}
            >
              {active === 0 ? (
                <div>
                  <p className="text-caption font-semibold text-text-muted">{t('vinLabel')}</p>
                  <div className="relative mt-2 overflow-hidden rounded-md border border-brand/30 bg-bg-subtle px-3 py-3">
                    <p className="vin text-small font-semibold text-brand">{t('vinValue')}</p>
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-y-0 w-1 bg-red-400/70 shadow-glow-red motion-reduce:hidden"
                      initial={{ x: -40 }}
                      animate={{ x: [-40, 240] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                  <div className="mt-4 flex h-11 items-center justify-center gap-2 rounded-md bg-cta text-small font-bold text-on-cta">
                    {t('checkButton')}
                    <ScanLine className="size-4" />
                  </div>
                  <p className="mt-4 flex items-center justify-center gap-2 text-caption text-text-muted">
                    <Hand className="size-4 text-cta" />
                    {t('tapHint')}
                  </p>
                </div>
              ) : null}

              {active === 1 ? (
                <div>
                  <div className="flex items-center gap-2 rounded-full bg-success-bg px-3 py-1.5 text-caption font-bold text-success-ink">
                    <ShieldCheck className="size-4" />
                    {t('previewBadge')}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-md bg-bg-subtle text-brand">
                      <CarFront className="size-6" />
                    </span>
                    <div>
                      <p className="text-small font-bold text-brand">{t('vehicle')}</p>
                      <p className="text-caption text-text-muted">{t('decoded')}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[t('sources'), t('recordCounts'), t('coverage')].map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-md border border-hairline p-2.5 text-caption">
                        <span className="text-text-muted">{item}</span>
                        <CheckCircle2 className="size-4 text-success" />
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-center text-small font-semibold text-brand">{t('noCharge')}</p>
                </div>
              ) : null}

              {active === 2 ? (
                <div>
                  <div className="flex items-center justify-between rounded-md bg-success-bg p-3 text-success-ink">
                    <span className="flex items-center gap-2 text-caption font-bold">
                      <Check className="size-4" />
                      {t('paymentApproved')}
                    </span>
                    <span className="num text-small font-bold">{t('amount')}</span>
                  </div>
                  <p className="mt-5 text-h3 font-extrabold text-brand">{t('reportReady')}</p>
                  <div className="mt-3 rounded-md border border-warning/30 bg-warning-bg p-3">
                    <p className="text-caption font-bold uppercase text-warning-ink">{t('verdict')}</p>
                    <p className="mt-1 text-small font-semibold text-warning-ink">{t('reportReason')}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <span className="flex items-center justify-center gap-2 rounded-md bg-brand px-2 py-3 text-caption font-bold text-on-brand">
                      <FileText className="size-4" />
                      {t('pdf')}
                    </span>
                    <span className="flex items-center justify-center gap-2 rounded-md border border-border px-2 py-3 text-caption font-bold text-brand">
                      <QrCode className="size-4" />
                      {t('qr')}
                    </span>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {active === 0 ? (
          <motion.div
            className="absolute -bottom-1 right-0 grid size-20 place-items-center rounded-full border border-white/50 bg-surface text-brand shadow-lift"
            initial={{ y: 0, rotate: -12 }}
            animate={reduce ? { y: 0, rotate: -12 } : { y: [0, -8, 0], rotate: [-12, -8, -12] }}
            transition={reduce ? { duration: 0 } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="absolute inset-0 rounded-full border border-red-300 animate-pulse-ring" />
            <Hand className="size-10" strokeWidth={1.5} />
          </motion.div>
        ) : null}
      </div>

      <ol className="relative z-10 grid grid-cols-3 gap-2">
        {stages.map((stage, index) => (
          <li key={stage} className={cn('border-t pt-2 text-caption', index === active ? 'border-red-400 text-on-inverse' : 'border-white/15 text-navy-300')}>
            <span className="num mr-1">0{index + 1}</span>
            {stage}
          </li>
        ))}
      </ol>
    </div>
  );
}
