import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { buttonClass } from '@/components/ui/button';
import { Chip, SectionHeading } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';

interface Plan {
  readonly name: string;
  readonly price: string;
  readonly note: string;
  readonly features: ReadonlyArray<string>;
  readonly saving: string;
}

export async function Pricing() {
  const t = await getTranslations('pricing');
  const nav = await getTranslations('nav');
  const plans = t.raw('plans') as ReadonlyArray<Plan>;

  return (
    <section id="pricing" className="scroll-mt-17 bg-bg-subtle py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lede={t('lede')} />
          <p className="max-w-[26ch] text-small text-text-muted sm:text-right">{t('note')}</p>
        </Reveal>

        <Stagger className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const featured = index === 1;
            return (
              <StaggerItem key={plan.name} className="h-full">
                <article
                  className={cn(
                    'flex h-full flex-col rounded-xl border p-6 transition-transform duration-200 sm:hover:-translate-y-1',
                    featured
                      ? 'border-transparent bg-surface-inverse text-on-inverse shadow-e3'
                      : 'border-hairline bg-surface',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={cn('text-h3 font-bold', featured ? 'text-on-inverse' : 'text-brand')}>{plan.name}</h3>
                    {featured ? <Chip tone="inverse">{t('badge')}</Chip> : null}
                  </div>

                  <p className={cn('num mt-5 text-display font-extrabold', featured ? 'text-on-inverse' : 'text-brand')}>
                    {plan.price}
                  </p>
                  <p className={cn('mt-1 text-small', featured ? 'text-navy-200' : 'text-text-muted')}>{plan.note}</p>
                  {plan.saving ? (
                    <p className={cn('mt-2 text-small font-semibold', featured ? 'text-navy-100' : 'text-success-ink')}>
                      {plan.saving}
                    </p>
                  ) : null}

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className={cn('flex gap-2 text-small', featured ? 'text-navy-100' : 'text-text')}
                      >
                        <Check className={cn('mt-0.5 size-4 shrink-0', featured ? 'text-navy-200' : 'text-success')} aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/#check"
                    className={buttonClass(featured ? 'primary' : 'secondary', 'md', 'mt-7 w-full')}
                  >
                    {nav('check')}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[70ch] text-caption text-text-subtle">{t('compare')}</p>
        </Reveal>
      </div>
    </section>
  );
}
