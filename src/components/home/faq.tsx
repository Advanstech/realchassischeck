import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { FaqAccordion, type FaqItem } from '@/components/ui/faq-accordion';
import { SectionHeading } from '@/components/ui/primitives';

export async function Faq() {
  const t = await getTranslations('faq');
  const items = t.raw('items') as ReadonlyArray<FaqItem>;

  return (
    <section id="faq" className="scroll-mt-17 bg-surface py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 sm:px-6 lg:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-24">
            <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <FaqAccordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
