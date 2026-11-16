import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { Icon } from '../Icon';
import styles from './Chip.module.css';

export type ChipVariant = 'default' | 'outline' | 'success' | 'warning' | 'error';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement> & ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'size' | 'onClick'> {
  /** Visual style of the chip */
  variant?: ChipVariant;
  /** Size of the chip */
  size?: ChipSize;
  /** Whether the chip is in a selected/active state */
  selected?: boolean;
  /** Disables interaction and dims the chip */
  disabled?: boolean;
  /** Called when the delete (×) button is pressed. When provided, a close icon is rendered. */
  onDelete?: () => void;
  /** Called when the chip itself is pressed. When provided, the chip renders as a clickable button. */
  onClick?: () => void;
  /** Chip label / content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Small, compact element used for tags, filters, and selections
 * (e.g. "React ×", selected filter pills).
 *
 * @example
 * ```tsx
 * <Chip>Default</Chip>
 * <Chip variant="success" selected>Active</Chip>
 * <Chip onDelete={() => console.log('removed')}>React</Chip>
 * <Chip onClick={() => setSelected((s) => !s)} selected={selected}>Filter</Chip>
 * ```
 */
export function Chip({
  variant = 'default',
  size = 'md',
  selected = false,
  disabled = false,
  onDelete,
  onClick,
  children,
  className,
  ...rest
}: ChipProps) {
  const classNames = [
    styles.chip,
    styles[variant],
    styles[size],
    selected ? styles.selected : '',
    disabled ? styles.disabled : '',
    onClick ? styles.clickable : '',
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {onDelete && (
        <button
          type="button"
          className={styles.deleteButton}
          aria-label="Remove"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <Icon as={X} size="xs" />
        </button>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={classNames}
        disabled={disabled}
        aria-pressed={selected}
        onClick={onClick}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={classNames}
      aria-disabled={disabled || undefined}
      {...(rest as HTMLAttributes<HTMLSpanElement>)}
    >
      {content}
    </span>
  );
}
