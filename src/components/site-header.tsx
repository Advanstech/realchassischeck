import Image from 'next/image';
import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="bg-header text-on-brand">
      <div className="mx-auto flex min-h-16 max-w-[1120px] items-center gap-3 px-4 py-3">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-sm text-on-brand no-underline">
          <Image src="/monogram-rcc.png" alt="" width={32} height={32} priority />
          <span className="text-h3 font-semibold">Real Chassis Check</span>
        </Link>
      </div>
    </header>
  );
}
