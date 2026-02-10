import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '@/components/ui/avatar';

describe('Avatar', () => {
  it('renders initials when no src provided', () => {
    render(<Avatar name="Dina Hediger" />);
    expect(screen.getByText('DH')).toBeInTheDocument();
  });

  it('renders single initial for single name', () => {
    render(<Avatar name="Dina" />);
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('renders image when src is provided', () => {
    render(<Avatar name="Dina Hediger" src="/avatar.jpg" />);
    const img = screen.getByAltText('Dina Hediger');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/avatar.jpg');
  });

  it('applies medium size by default', () => {
    render(<Avatar name="Test User" />);
    const el = screen.getByText('TU');
    expect(el.className).toContain('w-10');
  });

  it('applies small size', () => {
    render(<Avatar name="Test User" size="sm" />);
    const el = screen.getByText('TU');
    expect(el.className).toContain('w-8');
  });

  it('applies large size', () => {
    render(<Avatar name="Test User" size="lg" />);
    const el = screen.getByText('TU');
    expect(el.className).toContain('w-12');
  });

  it('applies custom className', () => {
    render(<Avatar name="Test User" className="ring-2" />);
    const el = screen.getByText('TU');
    expect(el.className).toContain('ring-2');
  });
});
