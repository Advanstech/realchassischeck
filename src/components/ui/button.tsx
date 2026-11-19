import { LoaderCircle } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'danger-outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold no-underline ' +
  'transition-[transform,background-color,border-color,box-shadow,color] duration-150 ' +
  'ease-[var(--ease-standard)] active:scale-[0.985] disabled:cursor-not-allowed ' +
  'disabled:opacity-60 disabled:active:scale-100';

/*
 * Red is action (one filled primary per screen). Danger is a different red and is
 * never a filled button, so a destructive action can never read as the next step.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-cta text-on-cta shadow-[0_14px_36px_-18px_rgb(226_8_5/0.65)] hover:bg-cta-hover',
  secondary: 'border border-border-strong bg-transparent text-brand hover:border-brand hover:bg-bg-subtle',
  ghost: 'bg-transparent text-brand hover:bg-bg-subtle',
  inverse: 'bg-white text-navy-950 hover:bg-navy-50',
  'danger-outline': 'border border-danger bg-transparent text-danger hover:bg-danger-bg',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-4 text-small',
  md: 'min-h-12 px-5 text-body',
  lg: 'min-h-14 px-7 text-body',
};

/** Shared with `<Link>` and `<button>` so both look identical. */
export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly loading?: boolean;
  readonly children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, size, className)}
    >
      {loading ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
