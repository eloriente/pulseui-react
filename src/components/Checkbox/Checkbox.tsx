import { useCallback } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text rendered adjacent to the checkbox */
  label?: ReactNode;
  /** Indeterminate state (partially checked) */
  indeterminate?: boolean;
  /** Error state — renders error styling */
  error?: boolean;
  /** Error message displayed below the checkbox, announced via aria-describedby */
  errorMessage?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Checkbox with indeterminate support and accessible label.
 *
 * @example
 * ```tsx
 * <Checkbox label="Accept terms" checked={checked} onChange={handleChange} />
 * ```
 */
export function Checkbox({
  label,
  indeterminate = false,
  error = false,
  errorMessage,
  disabled,
  className,
  id,
  'aria-describedby': ariaDescribedBy,
  ...props
}: CheckboxProps) {
  const setIndeterminateRef = useCallback(
    (el: HTMLInputElement | null) => {
      if (el) el.indeterminate = indeterminate;
    },
    [indeterminate],
  );

  const errorId = error && errorMessage && id ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label
        className={[
          styles.wrapper,
          disabled ? styles.disabled : '',
          error ? styles.error : '',
          className,
        ].filter(Boolean).join(' ')}
        htmlFor={id}
      >
        <span className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            id={id}
            className={styles.input}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            ref={setIndeterminateRef}
            {...props}
          />
          <span className={styles.checkmark} aria-hidden="true" />
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </label>
      {error && errorMessage && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
