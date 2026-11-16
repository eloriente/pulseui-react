import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  describe('Rendering', () => {
    it('renders with role="progressbar"', () => {
      render(<ProgressBar value={50} aria-label="Progress" />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('does not show a label by default', () => {
      render(<ProgressBar value={50} aria-label="Progress" />);
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });

    it('shows the percentage label when showLabel is true', () => {
      render(<ProgressBar value={50} showLabel aria-label="Progress" />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('shows a custom label instead of the percentage', () => {
      render(<ProgressBar value={3} max={5} showLabel label="3 of 5 steps" aria-label="Progress" />);
      expect(screen.getByText('3 of 5 steps')).toBeInTheDocument();
      expect(screen.queryByText('60%')).not.toBeInTheDocument();
    });

    it('clamps value within 0 and max', () => {
      render(<ProgressBar value={150} max={100} aria-label="Progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    });
  });

  describe('Variants', () => {
    it.each(['default', 'success', 'warning', 'error'] as const)(
      'applies the %s variant class to the fill element',
      (variant) => {
        const { container } = render(<ProgressBar value={50} variant={variant} aria-label="Progress" />);
        const fill = container.querySelector('[class*="fill"]');
        expect(fill?.className).toContain(variant);
      },
    );
  });

  describe('Sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('applies the %s size class to the track', (size) => {
      render(<ProgressBar value={50} size={size} aria-label="Progress" />);
      expect(screen.getByRole('progressbar').className).toContain(size);
    });
  });

  describe('Indeterminate', () => {
    it('omits aria-valuenow when indeterminate', () => {
      render(<ProgressBar indeterminate aria-label="Loading" />);
      expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    });

    it('sets aria-busy when indeterminate', () => {
      render(<ProgressBar indeterminate aria-label="Loading" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-busy', 'true');
    });

    it('applies the indeterminate class to the fill element', () => {
      const { container } = render(<ProgressBar indeterminate aria-label="Loading" />);
      const fill = container.querySelector('[class*="fill"]');
      expect(fill?.className).toContain('indeterminate');
    });
  });

  describe('Accessibility', () => {
    it('sets aria-valuemin and aria-valuemax', () => {
      render(<ProgressBar value={20} max={80} aria-label="Progress" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
      expect(progressbar).toHaveAttribute('aria-valuemax', '80');
    });

    it('supports aria-label', () => {
      render(<ProgressBar value={50} aria-label="Upload progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Upload progress');
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <span id="progress-heading">Download progress</span>
          <ProgressBar value={50} aria-labelledby="progress-heading" />
        </>,
      );
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-labelledby', 'progress-heading');
    });
  });

  describe('Styling', () => {
    it('applies custom className to the wrapper', () => {
      const { container } = render(<ProgressBar value={50} className="custom-class" aria-label="Progress" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('sets the fill width based on value and max', () => {
      const { container } = render(<ProgressBar value={25} max={50} aria-label="Progress" />);
      const fill = container.querySelector('[class*="fill"]') as HTMLElement;
      expect(fill.style.width).toBe('50%');
    });
  });
});
