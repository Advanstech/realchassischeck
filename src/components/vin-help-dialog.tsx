'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { RefObject } from 'react';

const LOCATIONS = [
  {
    title: 'Base of the windscreen',
    description: 'Look through the windscreen at the lower corner on the driver’s side.',
  },
  {
    title: 'Driver’s door post',
    description: 'Open the driver’s door and check the pillar or door-frame sticker.',
  },
  {
    title: 'Engine bay',
    description: 'Look for the VIN stamped on the body or displayed on a plate.',
  },
  {
    title: 'Registration document',
    description: 'Check the vehicle registration or title document for the same number.',
  },
] as const;

interface VinHelpDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly triggerRef: RefObject<HTMLButtonElement | null>;
}

export function VinHelpDialog({ open, onOpenChange, triggerRef }: VinHelpDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brand/60" />
        <Dialog.Content
          id="vin-help-dialog"
          className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-lg border border-border bg-surface p-5 text-text shadow-e3 sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:p-6"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-border-strong sm:hidden" aria-hidden="true" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-h2 font-semibold text-brand">Where is my VIN?</Dialog.Title>
              <Dialog.Description className="mt-2 text-small text-text-muted">
                Check these common locations. Enter the 17 characters exactly as shown.
              </Dialog.Description>
            </div>
            <Dialog.Close type="button" className="flex size-11 shrink-0 items-center justify-center rounded-md" aria-label="Close VIN location help">
              <X aria-hidden="true" />
            </Dialog.Close>
          </div>
          <ul className="mt-5 flex flex-col gap-4">
            {LOCATIONS.map((location) => (
              <li key={location.title}>
                <h3 className="font-semibold text-text">{location.title}</h3>
                <p className="mt-1 text-small text-text-muted">{location.description}</p>
              </li>
            ))}
          </ul>
          <Dialog.Close type="button" className="mt-6 min-h-12 w-full rounded-md bg-brand px-5 font-semibold text-on-brand">
            Got it
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
