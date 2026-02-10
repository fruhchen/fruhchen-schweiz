import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import type { ChatMessage } from '@/types';

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Timer state (shared between time-tracking page & sidebar)
  timerRunning: boolean;
  timerTask: string;
  timerProject: string;
  timerStartTime: number | null; // Date.now() when started
  startTimer: (project: string, task: string) => void;
  stopTimer: () => void;

  // Hydration flag — true once localStorage has been read
  _hasHydrated: boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      chatMessages: [],
      addChatMessage: (message) =>
        set((state) => ({ chatMessages: [...state.chatMessages, message] })),
      clearChat: () => set({ chatMessages: [] }),

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      timerRunning: false,
      timerTask: '',
      timerProject: '',
      timerStartTime: null,
      startTimer: (project, task) =>
        set({ timerRunning: true, timerProject: project, timerTask: task, timerStartTime: Date.now() }),
      stopTimer: () =>
        set({ timerRunning: false, timerProject: '', timerTask: '', timerStartTime: null }),

      _hasHydrated: false,
    }),
    {
      name: 'fruhchen-app-store',
      partialize: (state) => ({
        timerRunning: state.timerRunning,
        timerTask: state.timerTask,
        timerProject: state.timerProject,
        timerStartTime: state.timerStartTime,
      }),
      onRehydrateStorage: () => () => {
        useAppStore.setState({ _hasHydrated: true });
      },
    }
  )
);

/** Wait for Zustand to rehydrate from localStorage before reading persisted values. */
export function useStoreHydrated() {
  const storeHydrated = useAppStore((s) => s._hasHydrated);
  const [hydrated, setHydrated] = useState(storeHydrated);
  useEffect(() => {
    const unsub = useAppStore.subscribe((state) => {
      if (state._hasHydrated) {
        setHydrated(true);
        unsub();
      }
    });
    if (useAppStore.getState()._hasHydrated) {
      setHydrated(true);
      unsub();
    }
    return unsub;
  }, []);
  return hydrated;
}
