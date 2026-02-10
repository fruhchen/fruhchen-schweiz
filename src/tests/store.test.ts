import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/stores/app-store';
import type { ChatMessage, UserProfile } from '@/types';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      user: null,
      sidebarOpen: false,
      chatMessages: [],
      searchQuery: '',
    });
  });

  describe('user', () => {
    it('starts with null user', () => {
      expect(useAppStore.getState().user).toBeNull();
    });

    it('sets user', () => {
      const user = { id: '1', email: 'test@test.ch', role: 'parent' } as UserProfile;
      useAppStore.getState().setUser(user);
      expect(useAppStore.getState().user).toEqual(user);
    });

    it('clears user', () => {
      useAppStore.getState().setUser({ id: '1' } as UserProfile);
      useAppStore.getState().setUser(null);
      expect(useAppStore.getState().user).toBeNull();
    });
  });

  describe('sidebar', () => {
    it('starts closed', () => {
      expect(useAppStore.getState().sidebarOpen).toBe(false);
    });

    it('toggles sidebar', () => {
      useAppStore.getState().toggleSidebar();
      expect(useAppStore.getState().sidebarOpen).toBe(true);
      useAppStore.getState().toggleSidebar();
      expect(useAppStore.getState().sidebarOpen).toBe(false);
    });

    it('sets sidebar state directly', () => {
      useAppStore.getState().setSidebarOpen(true);
      expect(useAppStore.getState().sidebarOpen).toBe(true);
    });
  });

  describe('chat', () => {
    it('starts with empty messages', () => {
      expect(useAppStore.getState().chatMessages).toHaveLength(0);
    });

    it('adds a chat message', () => {
      const msg: ChatMessage = {
        id: '1',
        role: 'user',
        content: 'Hello',
        timestamp: new Date(),
      };
      useAppStore.getState().addChatMessage(msg);
      expect(useAppStore.getState().chatMessages).toHaveLength(1);
      expect(useAppStore.getState().chatMessages[0].content).toBe('Hello');
    });

    it('adds multiple messages', () => {
      useAppStore.getState().addChatMessage({ id: '1', role: 'user', content: 'Hi', timestamp: new Date() });
      useAppStore.getState().addChatMessage({ id: '2', role: 'assistant', content: 'Hello!', timestamp: new Date() });
      expect(useAppStore.getState().chatMessages).toHaveLength(2);
    });

    it('clears chat', () => {
      useAppStore.getState().addChatMessage({ id: '1', role: 'user', content: 'Hi', timestamp: new Date() });
      useAppStore.getState().clearChat();
      expect(useAppStore.getState().chatMessages).toHaveLength(0);
    });
  });

  describe('search', () => {
    it('starts with empty query', () => {
      expect(useAppStore.getState().searchQuery).toBe('');
    });

    it('sets search query', () => {
      useAppStore.getState().setSearchQuery('Frühchen');
      expect(useAppStore.getState().searchQuery).toBe('Frühchen');
    });
  });
});
