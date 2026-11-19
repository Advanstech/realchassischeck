import { Gauge, Globe2, ListChecks, QrCode, Send, ShieldCheck, type LucideIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/ui/primitives';
import { VerdictCard } from '@/components/ui/verdict-card';
import { cn } from '@/lib/cn';

const ICONS: ReadonlyArray<LucideIcon> = [ShieldCheck, Globe2, Gauge, ListChecks, QrCode, Send];
const SPANS = ['md:col-span-4', 'md:col-span-2', 'md:col-span-3', 'md:col-span-3', 'md:col-span-3', 'md:col-span-3'];

/** A dated odometer trace with the rollback called out, drawn as plain SVG. */
function OdometerTrace() {
  const points = [
    [8, 26], [30, 30], [52, 34], [74, 46], [96, 44], [118, 58], [140, 52], [162, 70], [184, 86], [206, 66], [228, 40],
  ];
  const path = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');
  return (
    <svg viewBox="0 0 236 100" className="mt-4 h-24 w-full" role="img" aria-label="Odometer readings fall by 41,000 km in March">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-brand" />
      {points.map(([x, y], index) => (
        <circle key={`${x}`} cx={x} cy={y} r={index === 9 ? 4 : 2} className={index === 9 ? 'fill-cta' : 'fill-brand'} />
      ))}
      <line x1="184" y1="86" x2="206" y2="66" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-cta" />
    </svg>
  );
}

export async function InsideReport() {
  const t = await getTranslations('report');
  const items = t.raw('items') as ReadonlyArray<{ title: string; body: string }>;

  return (
    <section id="report" className="bg-surface py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lede={t('lede')} />
        </Reveal>

        <Stagger className="mt-12 grid gap-4 md:grid-cols-6">
          {items.map((item, index) => {
            const Icon = ICONS[index] ?? ShieldCheck;
            return (
              <StaggerItem key={item.title} className={cn('h-full', SPANS[index])}>
                <article className="group flex h-full flex-col rounded-lg border border-hairline bg-paper p-5 transition-colors duration-200 hover:border-brand/25">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-md bg-bg-subtle text-brand">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-h3 font-bold text-brand">{item.title}</h3>
                  </div>
                  <p className="mt-3 max-w-[46ch] text-small text-text-muted">{item.body}</p>

                  {index === 0 ? (
                    <VerdictCard
                      state="clear"
                      title="Safe to buy, with two things to watch"
                      reasons={['No accident or theft records', '1 open recall, fixed free by the maker']}
                      compact
                      className="mt-5"
                    />
                  ) : null}
                  {index === 2 ? <OdometerTrace /> : null}
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
