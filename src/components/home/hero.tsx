import { BadgeCheck, FileCheck2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { TiltCard } from '@/components/motion/tilt-card';
import { HeroSample, HeroStage } from '@/components/home/hero-stage';
import { Chip, Eyebrow } from '@/components/ui/primitives';
import { VerdictCard } from '@/components/ui/verdict-card';
import { LookupForm } from '@/components/lookup-form';

/** Decorative QR proof square: a fixed pattern, hidden from assistive tech. */
function QrMark() {
  const cells = [
    [0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2],
    [0, 4], [1, 5], [2, 4], [3, 3], [3, 5], [4, 0], [4, 2], [4, 4], [5, 1], [5, 3], [5, 5],
  ];
  return (
    <svg viewBox="0 0 6 6" className="size-12 shrink-0 rounded-xs" aria-hidden="true">
      <rect width="6" height="6" fill="currentColor" opacity="0.06" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x ?? 0} y={y ?? 0} width="1" height="1" fill="currentColor" opacity="0.75" />
      ))}
    </svg>
  );
}

export async function Hero() {
  const t = await getTranslations('home');
  const sample = await getTranslations('home.sample');
  const reasons = t.raw('sample.reasons') as ReadonlyArray<string>;
  const trustPoints = t.raw('trustPoints') as ReadonlyArray<string>;

  return (
    <section id="check" className="hero-canvas hero-grid relative scroll-mt-17 overflow-x-clip lg:min-h-[calc(100svh-4rem)]">
      <HeroStage>
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-28 lg:pt-10">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 xl:gap-16 2xl:gap-24">
            <div>
              <Eyebrow tone="inverse">{t('eyebrow')}</Eyebrow>
              <h1 aria-label={t('title')} className="mt-5 text-hero font-extrabold text-on-inverse">
                <span aria-hidden="true" className="block lg:whitespace-nowrap">{t('titleLine1')}</span>{' '}
                <span aria-hidden="true" className="block lg:whitespace-nowrap">{t('titleLine2')}</span>
              </h1>
              <p className="mt-5 max-w-[52ch] text-body text-on-inverse-muted">{t('lede')}</p>

              <div className="mt-8 max-w-[36rem]" data-hero-panel>
                <LookupForm />
              </div>

              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-caption font-medium text-navy-200">
                    <BadgeCheck className="size-4 shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <HeroSample className="relative mx-auto w-full max-w-[34rem] pb-8">
              <TiltCard className="mx-auto max-w-[34rem]">
                <div className="relative [transform-style:preserve-3d]">
                  <div aria-hidden="true" className="absolute -inset-8 rounded-[40px] bg-white/10 blur-3xl" />
                  <article className="relative rounded-xl border border-white/60 bg-surface p-5 shadow-lift">
                    <div className="flex items-center justify-between gap-3">
                      <Chip tone="neutral">{sample('label')}</Chip>
                      <span className="vin text-caption text-text-subtle">{sample('reportId')}</span>
                    </div>

                    <div className="mt-4">
                      <h2 className="text-h3 font-bold text-brand">{sample('vehicle')}</h2>
                      <p className="mt-0.5 text-small text-text-muted">{sample('spec')}</p>
                      <p className="vin mt-1 text-caption text-text-subtle">{sample('vin')}</p>
                    </div>

                    <VerdictCard
                      state="caution"
                      title={sample('verdictTitle')}
                      reasons={reasons}
                      compact
                      className="mt-4"
                    />

                    <div className="mt-4 flex items-end justify-between gap-4 border-t border-hairline pt-4">
                      <p className="text-caption text-text-muted">{sample('footer')}</p>
                      <QrMark />
                    </div>
                  </article>

                  <div
                    className="absolute -bottom-6 -left-3 flex items-center gap-2 rounded-full border border-white/20 bg-surface-inverse px-3 py-2 text-caption font-semibold text-on-inverse shadow-e3"
                    style={{ transform: 'translateZ(64px)' }}
                  >
                    <FileCheck2 className="size-4 text-navy-200" aria-hidden="true" />
                    PDF · QR proof · SMS
                  </div>
                </div>
              </TiltCard>
            </HeroSample>
          </div>
        </div>
      </HeroStage>
    </section>
  );
}
