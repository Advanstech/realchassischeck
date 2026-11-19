import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import { ScrollSteps, type ScrollStep } from '@/components/motion/scroll-steps';
import { SectionHeading } from '@/components/ui/primitives';

export async function HowItWorks() {
  const t = await getTranslations('how');
  const steps = t.raw('steps') as ReadonlyArray<ScrollStep>;

  return (
    <section id="how" className="scroll-mt-17 bg-bg-subtle py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} lede={t('lede')} />
        </Reveal>
        <div className="mt-12 lg:mt-8">
          <ScrollSteps steps={steps} id="how-scene" />
        </div>
      </div>
    </section>
  );
}
