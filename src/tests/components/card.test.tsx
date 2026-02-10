import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders as div by default', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content').tagName).toBe('DIV');
  });

  it('renders as button when onClick is provided', () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Clickable</Card>);
    const card = screen.getByText('Clickable');
    expect(card.tagName).toBe('BUTTON');
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies medium padding by default', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content').className).toContain('p-6');
  });

  it('applies small padding', () => {
    render(<Card padding="sm">Content</Card>);
    expect(screen.getByText('Content').className).toContain('p-4');
  });

  it('applies large padding', () => {
    render(<Card padding="lg">Content</Card>);
    expect(screen.getByText('Content').className).toContain('p-8');
  });

  it('applies interactive styles when interactive', () => {
    render(<Card interactive>Content</Card>);
    expect(screen.getByText('Content').className).toContain('hover:shadow-soft-lg');
  });

  it('applies custom className', () => {
    render(<Card className="my-custom">Content</Card>);
    expect(screen.getByText('Content').className).toContain('my-custom');
  });
});

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });
});

describe('CardTitle', () => {
  it('renders as h3', () => {
    render(<CardTitle>Title</CardTitle>);
    const el = screen.getByText('Title');
    expect(el.tagName).toBe('H3');
  });
});

describe('CardDescription', () => {
  it('renders as p', () => {
    render(<CardDescription>Description</CardDescription>);
    const el = screen.getByText('Description');
    expect(el.tagName).toBe('P');
  });
});
