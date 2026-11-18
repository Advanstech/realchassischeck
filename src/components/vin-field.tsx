'use client';

import { normaliseIdentifier } from '@/lib/lookup-utils';

interface VinFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly error?: string;
}

export function VinField({ value, onChange, disabled = false, error }: VinFieldProps) {
  const confusing = /[IOQ]/.test(value);
  const hintId = 'identifier-hint';
  const errorId = 'identifier-error';
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between gap-3">
        <label htmlFor="identifier" className="font-semibold text-text">
          VIN or chassis number
        </label>
        <span className="shrink-0 text-caption text-text-muted" aria-live="polite">
          {value.length}/17
        </span>
      </div>
      <input
        id="identifier"
        name="identifier"
        className="vin w-full rounded-md border border-border-strong bg-surface px-4 text-h3 text-text placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-60"
        value={value}
        onChange={(event) => onChange(normaliseIdentifier(event.target.value))}
        onPaste={(event) => {
          event.preventDefault();
          onChange(normaliseIdentifier(event.clipboardData.getData('text')));
        }}
        placeholder="1M8GDM9AXKP042788"
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        maxLength={32}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={`${hintId}${error ? ` ${errorId}` : ''}`}
      />
      <p id={hintId} className="text-small text-text-muted">
        A VIN has 17 characters. Japanese chassis numbers look like NZE141-1234567.
      </p>
      {confusing ? (
        <p className="text-small text-warning-ink">VINs never contain the letters I, O or Q. Check those characters.</p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-small font-medium text-danger-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
