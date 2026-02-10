import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Aktiv</Badge>);
    expect(screen.getByText('Aktiv')).toBeInTheDocument();
  });

  it('uses brand variant by default', () => {
    render(<Badge>Test</Badge>);
    const badge = screen.getByText('Test');
    expect(badge.className).toContain('bg-brand-100');
  });

  it('applies variant styles', () => {
    render(<Badge variant="green">OK</Badge>);
    const badge = screen.getByText('OK');
    expect(badge.className).toContain('bg-emerald-100');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Test</Badge>);
    const badge = screen.getByText('Test');
    expect(badge.className).toContain('custom-class');
  });

  it('renders as a span element', () => {
    render(<Badge>Test</Badge>);
    const badge = screen.getByText('Test');
    expect(badge.tagName).toBe('SPAN');
  });

  it('supports all 9 color variants', () => {
    const variants = ['brand', 'violet', 'teal', 'rose', 'gray', 'green', 'blue', 'red', 'yellow'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    });
  });
});
