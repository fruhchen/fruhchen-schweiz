import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from '@/components/ui/icon';

describe('Icon', () => {
  it('renders a valid Lucide icon', () => {
    const { container } = render(<Icon name="Heart" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('returns null for invalid icon names', () => {
    const { container } = render(<Icon name="NonExistentIcon12345" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies custom size', () => {
    const { container } = render(<Icon name="Heart" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });

  it('applies custom className', () => {
    const { container } = render(<Icon name="Heart" className="text-red-500" />);
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('text-red-500')).toBe(true);
  });

  it('uses default size of 20', () => {
    const { container } = render(<Icon name="Heart" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('20');
  });
});
