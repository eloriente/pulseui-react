import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('renders a checkbox', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders label text', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('is not checked by default', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('sets indeterminate via ref', () => {
      render(<Checkbox indeterminate />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });
  });

  describe('Disabled/Loading', () => {
    it('is disabled when disabled=true', () => {
      render(<Checkbox disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('can be checked via click', async () => {
      const onChange = vi.fn();
      render(<Checkbox onChange={onChange} />);
      await userEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('sets aria-invalid when error=true', () => {
      render(<Checkbox error />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('links errorMessage via aria-describedby when error=true', () => {
      render(<Checkbox id="terms" error errorMessage="You must accept the terms" />);
      const checkbox = screen.getByRole('checkbox');
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('You must accept the terms');
      expect(checkbox).toHaveAttribute('aria-describedby', error.id);
    });

    it('merges a consumer-supplied aria-describedby with the error id', () => {
      render(
        <Checkbox id="terms" error errorMessage="Required" aria-describedby="hint" />,
      );
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-describedby', 'hint terms-error');
    });

    it('does not render an alert when error is false', () => {
      render(<Checkbox errorMessage="Required" />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
