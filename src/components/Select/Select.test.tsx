import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Select } from './Select';

describe('Select', () => {
  const renderSelect = () =>
    render(
      <Select id="plan" placeholder="Choose">
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </Select>
    );

  describe('Rendering', () => {
    it('renders a combobox', () => {
      renderSelect();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders placeholder option', () => {
      renderSelect();
      expect(screen.getByText('Choose')).toBeInTheDocument();
    });

    it('renders children options', () => {
      renderSelect();
      expect(screen.getByRole('option', { name: 'Free' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Pro' })).toBeInTheDocument();
    });

    it('hides the placeholder option from the dropdown list', () => {
      renderSelect();
      expect(screen.getByText('Choose')).toHaveAttribute('hidden');
    });
  });

  describe('Disabled/Loading', () => {
    it('is disabled when disabled=true', () => {
      render(<Select disabled><option value="a">A</option></Select>);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('allows selecting an option', async () => {
      renderSelect();
      await userEvent.selectOptions(screen.getByRole('combobox'), 'pro');
      expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('pro');
    });
  });

  describe('Styling', () => {
    it('sets aria-invalid when error=true', () => {
      render(<Select error><option value="a">A</option></Select>);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows error message', () => {
      render(<Select id="s" error errorMessage="Required"><option value="a">A</option></Select>);
      expect(screen.getByRole('alert')).toHaveTextContent('Required');
    });

    it('merges a consumer-supplied aria-describedby with the error id', () => {
      render(
        <Select id="s" error errorMessage="Required" aria-describedby="hint">
          <option value="a">A</option>
        </Select>,
      );
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', 'hint s-error');
    });
  });
});
