import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '@/components/ui/empty-state';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        icon="Inbox"
        title="Keine Einträge"
        description="Es gibt noch keine Einträge."
      />
    );
    expect(screen.getByText('Keine Einträge')).toBeInTheDocument();
    expect(screen.getByText('Es gibt noch keine Einträge.')).toBeInTheDocument();
  });

  it('renders action button when actionLabel and onAction provided', () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        icon="Plus"
        title="Leer"
        description="Nichts da"
        actionLabel="Erstellen"
        onAction={onAction}
      />
    );
    const button = screen.getByText('Erstellen');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('does not render action button without onAction', () => {
    render(
      <EmptyState
        icon="Inbox"
        title="Leer"
        description="Nichts da"
        actionLabel="Erstellen"
      />
    );
    expect(screen.queryByText('Erstellen')).not.toBeInTheDocument();
  });
});
