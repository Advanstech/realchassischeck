import { ClosingCta } from '@/components/home/closing-cta';
import { Faq } from '@/components/home/faq';
import { Hero } from '@/components/home/hero';
import { HowItWorks } from '@/components/home/how-it-works';
import { InsideReport } from '@/components/home/inside-report';
import { Pricing } from '@/components/home/pricing';
import { TrustStrip } from '@/components/home/trust-strip';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main id="main">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <InsideReport />
        <Pricing />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
