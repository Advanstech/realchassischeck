import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { VinField } from './vin-field';

const meta = {
  title: 'Forms/VinField',
  component: VinField,
  tags: ['autodocs'],
  args: { value: '', onChange: () => {}, disabled: false },
  decorators: [(Story) => <div className="w-[328px] bg-surface p-4 sm:w-[480px]"><Story /></div>],
} satisfies Meta<typeof VinField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const ValidVIN: Story = { args: { value: '1M8GDM9AXKP042788' } };
export const JapaneseChassis: Story = { args: { value: 'NZE141-1234567' } };
export const ConfusingCharacter: Story = { args: { value: '1M8GDM9AXKP04278O' } };
export const ValidationError: Story = {
  args: { value: '1M8GDM9AXKP04278', error: 'A VIN has 17 characters. You typed 16.' },
};
export const Disabled: Story = { args: { value: '1M8GDM9AXKP042788', disabled: true } };
export const Dark: Story = {
  args: { value: '1M8GDM9AXKP042788' },
  decorators: [(Story) => <div data-theme="dark" className="bg-bg p-4"><Story /></div>],
};
export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState(args.value);
    return <VinField {...args} value={value} onChange={setValue} />;
  },
};
