import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect } from 'storybook/test';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/Feedback/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'success', 'warning', 'error'] },
    indeterminate: { control: 'boolean' },
    showLabel: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    value: 40,
    max: 100,
    size: 'md',
    variant: 'default',
    'aria-label': 'Progress',
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 40 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const progressbar = canvas.getByRole('progressbar');
    await expect(progressbar).toHaveAttribute('aria-valuenow', '40');
  },
};

export const WithLabel: Story = {
  args: { value: 65, showLabel: true },
};

export const CustomLabel: Story = {
  args: { value: 3, max: 5, showLabel: true, label: '3 of 5 steps' },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, 'aria-label': 'Uploading file' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const progressbar = canvas.getByRole('progressbar');
    await expect(progressbar).not.toHaveAttribute('aria-valuenow');
    await expect(progressbar).toHaveAttribute('aria-busy', 'true');
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ProgressBar {...args} size="sm" aria-label="Small progress" />
      <ProgressBar {...args} size="md" aria-label="Medium progress" />
      <ProgressBar {...args} size="lg" aria-label="Large progress" />
    </div>
  ),
  args: { value: 55 },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ProgressBar {...args} variant="default" aria-label="Default progress" />
      <ProgressBar {...args} variant="success" aria-label="Success progress" />
      <ProgressBar {...args} variant="warning" aria-label="Warning progress" />
      <ProgressBar {...args} variant="error" aria-label="Error progress" />
    </div>
  ),
  args: { value: 70 },
};
