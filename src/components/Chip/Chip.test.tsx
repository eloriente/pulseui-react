import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  describe('Rendering', () => {
    it('renders children text', () => {
      render(<Chip>React</Chip>);
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('renders as a span by default', () => {
      const { container } = render(<Chip>Tag</Chip>);
      expect(container.querySelector('span')?.className).toContain('chip');
      expect(container.querySelector('button')).toBeNull();
    });

    it('renders as a button when onClick is provided', () => {
      render(<Chip onClick={() => {}}>Filter</Chip>);
      expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
    });

    it('does not render a delete button when onDelete is not passed', () => {
      render(<Chip>Tag</Chip>);
      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
    });

    it('renders a delete button when onDelete is passed', () => {
      render(<Chip onDelete={() => {}}>Tag</Chip>);
      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it.each(['default', 'outline', 'success', 'warning', 'error'] as const)(
      'applies %s variant class',
      (variant) => {
        const { container } = render(<Chip variant={variant}>Chip</Chip>);
        expect((container.firstChild as HTMLElement).className).toContain(variant);
      },
    );
  });

  describe('Sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('applies %s size class', (size) => {
      const { container } = render(<Chip size={size}>Chip</Chip>);
      expect((container.firstChild as HTMLElement).className).toContain(size);
    });
  });

  describe('Selected/Disabled', () => {
    it('applies selected styling', () => {
      const { container } = render(<Chip selected>Chip</Chip>);
      expect((container.firstChild as HTMLElement).className).toContain('selected');
    });

    it('applies disabled styling and attribute on clickable chip', () => {
      render(
        <Chip disabled onClick={() => {}}>
          Chip
        </Chip>,
      );
      expect(screen.getByRole('button', { name: 'Chip' })).toBeDisabled();
    });

    it('sets aria-disabled on static disabled chip', () => {
      const { container } = render(<Chip disabled>Chip</Chip>);
      expect(container.firstChild).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when the chip is clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Chip onClick={onClick}>Filter</Chip>);
      await user.click(screen.getByRole('button', { name: 'Filter' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onDelete when the delete button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(<Chip onDelete={onDelete}>Tag</Chip>);
      await user.click(screen.getByRole('button', { name: /remove/i }));
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onClick when the delete button is clicked (stopPropagation)', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const onDelete = vi.fn();
      render(
        <Chip onClick={onClick} onDelete={onDelete}>
          Tag
        </Chip>,
      );
      await user.click(screen.getByRole('button', { name: /remove/i }));
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not call onDelete when the delete button is disabled', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(
        <Chip disabled onDelete={onDelete}>
          Tag
        </Chip>,
      );
      await user.click(screen.getByRole('button', { name: /remove/i }));
      expect(onDelete).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('sets aria-pressed reflecting selected state on clickable chip', () => {
      render(
        <Chip onClick={() => {}} selected>
          Filter
        </Chip>,
      );
      expect(screen.getByRole('button', { name: 'Filter' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('sets aria-pressed to false by default on clickable chip', () => {
      render(<Chip onClick={() => {}}>Filter</Chip>);
      expect(screen.getByRole('button', { name: 'Filter' })).toHaveAttribute('aria-pressed', 'false');
    });

    it('gives the delete button an accessible label', () => {
      render(<Chip onDelete={() => {}}>Tag</Chip>);
      expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(<Chip className="my-class">Chip</Chip>);
      expect(container.firstChild).toHaveClass('my-class');
    });
  });
});
