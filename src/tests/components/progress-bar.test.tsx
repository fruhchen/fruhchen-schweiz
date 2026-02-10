import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '@/components/ui/progress-bar';

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('shows label when showLabel is true', () => {
    render(<ProgressBar value={75} showLabel />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('does not show label by default', () => {
    render(<ProgressBar value={75} />);
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
  });

  it('clamps value to 0-100%', () => {
    render(<ProgressBar value={150} showLabel />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('clamps negative values to 0', () => {
    render(<ProgressBar value={-10} showLabel />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('calculates percentage from custom max', () => {
    render(<ProgressBar value={5} max={10} showLabel />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('applies small size', () => {
    const { container } = render(<ProgressBar value={50} size="sm" />);
    const track = container.querySelector('.h-1\\.5');
    expect(track).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(<ProgressBar value={50} className="my-class" />);
    expect(container.firstChild).toHaveClass('my-class');
  });
});
