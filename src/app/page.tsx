import { getTranslations } from 'next-intl/server';
import { BadgeCheck, SearchCheck, ShieldCheck } from 'lucide-react';
import { LookupForm } from '@/components/lookup-form';
import { SiteHeader } from '@/components/site-header';

export default async function HomePage() {
  const brand = await getTranslations('brand');
  const home = await getTranslations('home');

  return (
    <div className="min-h-screen bg-bg-subtle">
      <SiteHeader />
      <main className="mx-auto max-w-[1120px] px-4 py-8 sm:py-14">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
          <section className="flex flex-col gap-5">
            <p className="text-small font-semibold uppercase tracking-wide text-link">Built for car buyers in Ghana</p>
            <h1 className="max-w-[18ch] text-display font-semibold text-brand">{home('title')}</h1>
            <p className="max-w-[58ch] text-body text-text-muted">{home('lede')}</p>
            <div className="rounded-lg bg-info-bg p-4 text-info-ink">
              <p className="font-semibold">Start free. Pay only if records are available.</p>
              <p className="mt-1 text-small">We show the vehicle decode, record counts and sources before any payment decision.</p>
            </div>
            <ul className="mt-2 flex flex-col gap-4 text-small text-text">
              <li className="flex gap-3"><SearchCheck className="shrink-0 text-brand" aria-hidden="true" /><span><strong>Know what was searched.</strong> See covered and uncovered countries clearly.</span></li>
              <li className="flex gap-3"><BadgeCheck className="shrink-0 text-brand" aria-hidden="true" /><span><strong>No invented history.</strong> The free preview shows facts and record counts only.</span></li>
              <li className="flex gap-3"><ShieldCheck className="shrink-0 text-brand" aria-hidden="true" /><span><strong>No surprise charge.</strong> A free check never creates an order or takes payment.</span></li>
            </ul>
          </section>
          <div className="lg:sticky lg:top-8">
            <LookupForm />
            <p className="mt-4 text-center text-small text-text-muted">{brand('tagline')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
