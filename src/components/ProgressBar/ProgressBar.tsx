import styles from './ProgressBar.module.css';

export type ProgressBarSize = 'sm' | 'md' | 'lg';
export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error';

export interface ProgressBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current progress value. Ignored when `indeterminate` is `true`. Default `0` */
  value?: number;
  /** Maximum value `value` is measured against. Default `100` */
  max?: number;
  size?: ProgressBarSize;
  variant?: ProgressBarVariant;
  /** Shows an animated sweep instead of a fixed fill, for unknown-duration loading. Default `false` */
  indeterminate?: boolean;
  /** Shows a percentage/label text below the track. Default `false` */
  showLabel?: boolean;
  /** Custom label text, overrides the auto-generated percentage */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Progress bar for showing task or loading completion, with an
 * indeterminate mode for unknown-duration operations.
 *
 * @example
 * ```tsx
 * <ProgressBar value={60} showLabel />
 * <ProgressBar indeterminate aria-label="Uploading file" />
 * ```
 */
export function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  indeterminate = false,
  showLabel = false,
  label,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(max, Math.max(0, value));
  const percentage = max > 0 ? (clampedValue / max) * 100 : 0;
  const displayLabel = label ?? `${Math.round(percentage)}%`;

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      {...props}
    >
      <div
        className={[styles.track, styles[size]].filter(Boolean).join(' ')}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-busy={indeterminate || undefined}
      >
        <div
          className={[
            styles.fill,
            styles[variant],
            indeterminate ? styles.indeterminate : '',
          ].filter(Boolean).join(' ')}
          style={indeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
      {showLabel && <span className={styles.label}>{displayLabel}</span>}
    </div>
  );
}
