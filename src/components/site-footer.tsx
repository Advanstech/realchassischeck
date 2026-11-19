import { Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ThemeSwitch } from '@/components/theme/theme-switch';

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const brand = await getTranslations('brand');
  const theme = await getTranslations('theme');
  const trustPoints = t.raw('trustPoints') as ReadonlyArray<string>;

  const explore = [
    { href: '/#check', label: nav('check') },
    { href: '/#how', label: nav('how') },
    { href: '/#pricing', label: nav('pricing') },
    { href: '/#faq', label: nav('faq') },
  ];

  return (
    <footer className="rail-canvas relative isolate overflow-hidden text-on-inverse">
      <Image
        src="/monogram-rcc.png"
        alt=""
        width={727}
        height={197}
        className="pointer-events-none absolute -bottom-8 -right-40 z-0 h-auto w-[44rem] max-w-none select-none opacity-[0.07] sm:-right-24 sm:w-[58rem] lg:-right-12 lg:w-[72rem]"
        data-testid="footer-watermark"
      />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.65fr_1fr] lg:gap-16">
          <div>
            <p className="text-eyebrow font-semibold uppercase text-navy-300">{t('kicker')}</p>
            <div className="mt-5 flex items-center gap-3">
              <Image src="/monogram-rcc.png" alt="" width={727} height={197} style={{ height: 44, width: 'auto' }} />
              <span className="text-h3 font-bold tracking-tight">{brand('name')}</span>
            </div>
            <p className="mt-6 max-w-[17ch] text-h1 font-extrabold tracking-tight text-balance">{t('statement')}</p>
            <p className="mt-5 max-w-[42ch] text-small text-on-inverse-muted">{t('blurb')}</p>
            <p className="mt-5 text-caption text-navy-300">{brand('tagline')}</p>
          </div>

          <nav aria-label={t('explore')} className="lg:pt-12">
            <h2 className="text-eyebrow font-semibold uppercase text-navy-300">{t('explore')}</h2>
            <ul className="mt-4 flex flex-col gap-1">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-11 items-center border-b border-white/10 text-small font-medium text-navy-100 no-underline transition-colors duration-150 hover:border-white/30 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:pt-12">
            <h2 className="text-eyebrow font-semibold uppercase text-navy-300">{t('trust')}</h2>
            <ul className="mt-4 flex flex-col gap-5">
              {trustPoints.map((point, index) => (
                <li key={point} className="flex gap-3 text-small text-on-inverse-muted">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5">
                    <Check className="size-4 text-navy-200" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="num mr-2 text-caption text-navy-300" aria-hidden="true">0{index + 1}</span>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-6 text-caption text-navy-300 md:flex-row md:items-end md:justify-between">
          <div>
            <p>© 2026 {t('rights')}.</p>
            <p className="mt-1 max-w-[58ch]">{t('legalPending')}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span>{theme('label')}</span>
              <ThemeSwitch tone="inverse" showLabels />
            </div>
          </div>
          <Link href="/admin" className="min-h-11 text-navy-200 no-underline hover:text-white">
            {t('admin')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
