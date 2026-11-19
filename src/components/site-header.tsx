import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { AuthNav } from '@/components/auth/auth-nav';
import { HeaderFrame } from '@/components/nav/header-frame';
import { MobileNav, type NavLink } from '@/components/nav/mobile-nav';
import { PrimaryNav } from '@/components/nav/primary-nav';
import { ThemeMenu } from '@/components/theme/theme-switch';
import { buttonClass } from '@/components/ui/button';

export async function SiteHeader() {
  const t = await getTranslations('nav');
  const brand = await getTranslations('brand');

  const links: ReadonlyArray<NavLink> = [
    { href: '/', label: t('home') },
    { href: '/#how', label: t('how') },
    { href: '/#pricing', label: t('pricing') },
    { href: '/#faq', label: t('faq') },
  ];

  return (
    <HeaderFrame>
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link href="/" aria-label={brand('name')} className="flex min-h-11 items-center justify-self-start gap-3 rounded-sm text-on-inverse no-underline">
          <Image src="/monogram-rcc.png" alt="" width={727} height={197} priority style={{ height: 34, width: 'auto' }} />
          <span className="hidden text-h3 font-bold tracking-tight sm:block">{brand('name')}</span>
        </Link>

        <PrimaryNav links={links} />

        <div className="flex items-center justify-self-end gap-2">
          <AuthNav />
          <ThemeMenu tone="inverse" />
          <Link href="/#check" className={buttonClass('inverse', 'sm', 'hidden md:inline-flex')}>
            {t('check')}
          </Link>
          <div className="md:hidden">
            <MobileNav links={links} cta={t('check')} closeLabel={t('closeMenu')} auth={<AuthNav variant="sheet" />} />
          </div>
        </div>
      </div>
    </HeaderFrame>
  );
}
