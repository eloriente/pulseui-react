import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Switch.module.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Accessible label — required for screen readers */
  label?: ReactNode;
  size?: SwitchSize;
  /** Error state — renders error styling */
  error?: boolean;
  /** Error message displayed below the switch, announced via aria-describedby */
  errorMessage?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Toggle switch — a styled checkbox rendered as an on/off switch.
 *
 * @example
 * ```tsx
 * <Switch label="Enable notifications" checked={enabled} onChange={handleChange} />
 * ```
 */
export function Switch({
  label,
  size = 'md',
  error = false,
  errorMessage,
  disabled,
  className,
  id,
  'aria-describedby': ariaDescribedBy,
  ...props
}: SwitchProps) {
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
        <span className={[styles.track, styles[size]].join(' ')}>
          <input
            type="checkbox"
            role="switch"
            id={id}
            className={styles.input}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            {...props}
          />
          <span className={styles.thumb} aria-hidden="true" />
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
