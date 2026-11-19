'use client';

import { CircleHelp } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

// Keep Radix and the help content out of the initial lookup bundle.
const VinHelpDialog = dynamic(() => import('./vin-help-dialog').then((module) => module.VinHelpDialog), { ssr: false });

export function VinHelpSheet() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="flex min-h-11 w-fit items-center gap-2 font-semibold text-link underline-offset-3"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={loaded ? 'vin-help-dialog' : undefined}
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
      >
        <CircleHelp className="size-5" aria-hidden="true" />
        Where is my VIN?
      </button>
      {loaded ? <VinHelpDialog open={open} onOpenChange={setOpen} triggerRef={triggerRef} /> : null}
    </>
  );
}
