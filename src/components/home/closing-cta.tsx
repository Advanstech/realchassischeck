import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ClosingCar } from '@/components/home/closing-car';
import { Reveal } from '@/components/motion/reveal';
import { buttonClass } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/primitives';

export async function ClosingCta() {
  const t = await getTranslations('closing');

  return (
    <section className="hero-canvas relative isolate overflow-hidden">
      <ClosingCar />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 pb-64 pt-20 text-center sm:px-6 sm:pb-80 sm:pt-28 lg:px-8 lg:pb-[26rem]">
        <Reveal>
          <Eyebrow tone="inverse" className="justify-center">
            {t('eyebrow')}
          </Eyebrow>
          <h2 className="mx-auto mt-5 max-w-[22ch] text-display-lg font-extrabold text-balance text-on-inverse">
            {t('title')}
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-body text-on-inverse-muted">{t('lede')}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/#check" className={buttonClass('primary', 'lg', 'w-full sm:w-auto')}>
              {t('cta')}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <Link href="/#report" className={buttonClass('ghost', 'lg', 'w-full text-on-inverse hover:bg-white/10 sm:w-auto')}>
              {t('secondary')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
