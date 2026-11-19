import { Database, FileCheck2, MapPinned, UserRoundCheck, type LucideIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { Eyebrow } from '@/components/ui/primitives';

const ICONS: ReadonlyArray<LucideIcon> = [Database, UserRoundCheck, MapPinned, FileCheck2];

interface TrustItem {
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
}

/** A substantial proof ledger replaces the old low-information moving ticker. */
export async function TrustStrip() {
  const t = await getTranslations('home.trustReel');
  const items = t.raw('items') as ReadonlyArray<TrustItem>;

  return (
    <section aria-labelledby="trust-title" className="rail-canvas hero-grid relative overflow-hidden text-on-inverse">
      <div className="relative mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <Eyebrow tone="inverse">{t('eyebrow')}</Eyebrow>
              <h2 id="trust-title" className="mt-4 max-w-[13ch] text-display-lg font-extrabold text-balance">
                {t('title')}
              </h2>
            </div>
            <p className="max-w-[54ch] text-body text-on-inverse-muted lg:justify-self-end">{t('lede')}</p>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => {
            const Icon = ICONS[index] ?? Database;
            return (
              <StaggerItem key={item.title} className="h-full">
                <article className="group relative flex min-h-72 flex-col overflow-hidden rounded-lg border border-white/15 bg-white/5 p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-16 place-items-center rounded-md border border-white/15 bg-white/5 text-navy-100">
                      <Icon className="size-8" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className="num text-h3 font-bold text-navy-300" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-8 text-eyebrow font-semibold uppercase text-navy-300">{item.kicker}</p>
                  <h3 className="mt-2 text-h3 font-bold text-on-inverse">{item.title}</h3>
                  <p className="mt-3 text-small text-on-inverse-muted">{item.body}</p>
                  <Icon
                    className="pointer-events-none absolute -bottom-8 -right-6 size-36 text-white opacity-[0.035] transition-transform duration-300 group-hover:rotate-3"
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
