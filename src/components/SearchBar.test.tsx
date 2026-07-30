import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from './SearchBar';

describe('SearchBar component', () => {
  it('renders input with value and handles change events', () => {
    const handleChange = vi.fn();
    const handleClear = vi.fn();

    render(
      <SearchBar
        value="amlodipine"
        onChange={handleChange}
        onClear={handleClear}
      />
    );

    const input = screen.getByRole('textbox', { name: /Search medications/i });
    expect(input).toHaveValue('amlodipine');

    fireEvent.change(input, { target: { value: 'metformin' } });
    expect(handleChange).toHaveBeenCalledWith('metformin');
  });

  it('renders clear button when value is present and triggers clear callback', () => {
    const handleClear = vi.fn();
    render(
      <SearchBar value="salbutamol" onChange={() => {}} onClear={handleClear} />
    );

    const clearBtn = screen.getByRole('button', { name: /Clear search/i });
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
