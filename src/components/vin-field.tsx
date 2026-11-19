'use client';

import { useTranslations } from 'next-intl';
import { normaliseIdentifier } from '@/lib/lookup-utils';
import { VinHelpSheet } from './vin-help-sheet';

interface VinFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly error?: string;
}

export function VinField({ value, onChange, disabled = false, error }: VinFieldProps) {
  const t = useTranslations('lookup');
  const confusing = /[IOQ]/.test(value);
  const hintId = 'identifier-hint';
  const errorId = 'identifier-error';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between gap-3">
        <label htmlFor="identifier" className="text-small font-semibold text-text">
          {t('vinLabel')}
        </label>
        <span className="num shrink-0 text-caption text-text-subtle" aria-live="polite">
          {value.length}/17
        </span>
      </div>
      <input
        id="identifier"
        name="identifier"
        className="vin h-14 w-full rounded-md border border-border-strong bg-bg-subtle px-4 text-h3 text-text placeholder:text-text-subtle/70 hover:border-brand/40 focus:border-brand focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger"
        value={value}
        onChange={(event) => onChange(normaliseIdentifier(event.target.value))}
        onPaste={(event) => {
          event.preventDefault();
          onChange(normaliseIdentifier(event.clipboardData.getData('text')));
        }}
        placeholder={t('vinPlaceholder')}
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        maxLength={32}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={`${hintId}${error ? ` ${errorId}` : ''}`}
      />
      <p id={hintId} className="text-caption text-text-muted">
        {t('vinHint')}
      </p>
      <VinHelpSheet />
      {confusing ? (
        <p className="text-small font-medium text-warning-ink">{t('confusing')}</p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-small font-medium text-danger-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
