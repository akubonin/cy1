import { create } from 'zustand';
import type { UploadState } from '../types/trackUploadTypes';


export const useUploadStore = create<UploadState>((set) => ({
  uploadedFiles: [],
  addFile: (file) => set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
}));