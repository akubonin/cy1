import { create } from 'zustand';

interface LibraryState {
  refetchLibraryTracks: () => void;
}

export const useLibraryStore = create<LibraryState>(() => ({
  refetchLibraryTracks: () => {},
}));
