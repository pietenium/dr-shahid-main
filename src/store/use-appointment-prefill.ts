import { create } from "zustand";

interface AppointmentPrefill {
  message?: string;
  source?: string; // e.g., "article:knee-replacement-slug"
  preferredDate?: string;

  // Actions
  setPrefill: (data: Partial<AppointmentPrefill>) => void;
  clearPrefill: () => void;
}

export const useAppointmentPrefill = create<AppointmentPrefill>()((set) => ({
  message: undefined,
  source: undefined,
  preferredDate: undefined,

  setPrefill: (data) => set((state) => ({ ...state, ...data })),
  clearPrefill: () =>
    set({ message: undefined, source: undefined, preferredDate: undefined }),
}));
