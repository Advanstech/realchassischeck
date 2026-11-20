'use client';

import { ArrowLeft, Check, ShieldCheck } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { buttonClass } from '@/components/ui/button';
import { Chip, Eyebrow } from '@/components/ui/primitives';
import type { AuthAccount } from '@/lib/auth';
import { maskContact } from '@/lib/mask-contact';

/** Full-bleed greeting band: the account page's brand moment and path home. */
export function AccountHero({ account }: { readonly account: AuthAccount }) {
  const t = useTranslations('account');
  const masked = maskContact(account.phone ?? account.email ?? '—');

  const band = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: band, offset: ['start start', 'end start'] });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, 72]);

  return (
    <section ref={band} className="hero-canvas hero-grid relative isolate overflow-hidden text-on-inverse">
      <motion.div
        style={{ y: watermarkY }}
        aria-hidden="true"
        className="account-watermark pointer-events-none absolute -bottom-16 -right-20 opacity-[0.07]"
      >
        <Image
          src="/monogram-rcc.png"
          alt=""
          width={727}
          height={197}
          className="h-auto w-[24rem] max-w-none select-none sm:w-[32rem]"
        />
      </motion.div>
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div>
          <Eyebrow tone="inverse">{t('title')}</Eyebrow>
          <h1 className="mt-4 text-h1 font-extrabold text-balance">
            {t('hello', { name: account.name ?? t('nameEmpty') })}
          </h1>
          <p className="mt-3 text-body text-on-inverse-muted">{t('greeting', { contact: masked })}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Chip tone="inverse">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              {t('roleBuyer')}
            </Chip>
            <Chip tone="inverse">
              <Check className="size-3.5" aria-hidden="true" />
              {t(`levels.${account.level}`)}
            </Chip>
          </div>
        </div>
        <Link href="/" className={buttonClass('inverse', 'md')}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('backHome')}
        </Link>
      </div>
    </section>
  );
}
