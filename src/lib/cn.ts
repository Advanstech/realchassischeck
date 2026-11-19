import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/*
 * The type scale is token-driven (text-body, text-caption, text-display-lg …), so
 * tailwind-merge has to be told those names are font sizes. Without this it reads
 * `text-caption` as a colour and drops it whenever a real colour follows, which
 * silently flattens the whole type scale.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display-xl', 'display-lg', 'h1', 'h2', 'h3', 'body', 'small', 'caption', 'eyebrow'] },
      ],
    },
  },
});

/** Compose conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
