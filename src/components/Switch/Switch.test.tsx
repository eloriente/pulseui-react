import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  describe('Rendering', () => {
    it('renders a switch (checkbox with role=switch)', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders label text', () => {
      render(<Switch label="Dark mode" />);
      expect(screen.getByText('Dark mode')).toBeInTheDocument();
    });

    it('is not checked by default', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).not.toBeChecked();
    });
  });

  describe('Sizes', () => {
    it('applies size class to track', () => {
      const { container } = render(<Switch size="lg" />);
      expect(container.querySelector('span')?.className).toContain('lg');
    });
  });

  describe('Disabled/Loading', () => {
    it('is disabled when disabled=true', () => {
      render(<Switch disabled />);
      expect(screen.getByRole('switch')).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('fires onChange when clicked', async () => {
      const onChange = vi.fn();
      render(<Switch onChange={onChange} />);
      await userEvent.click(screen.getByRole('switch'));
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('sets aria-invalid when error=true', () => {
      render(<Switch error />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
    });

    it('links errorMessage via aria-describedby when error=true', () => {
      render(<Switch id="notifications" error errorMessage="This setting is required" />);
      const toggle = screen.getByRole('switch');
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('This setting is required');
      expect(toggle).toHaveAttribute('aria-describedby', error.id);
    });

    it('accepts a ReactNode label', () => {
      render(<Switch label={<strong>Dark mode</strong>} />);
      expect(screen.getByText('Dark mode').tagName).toBe('STRONG');
    });
  });
});
