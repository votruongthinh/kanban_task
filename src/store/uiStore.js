import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUiStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      isSidebarVisible: true,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleSidebar: () =>
        set((state) => ({ isSidebarVisible: !state.isSidebarVisible })),
    }),
    { name: "ui-storage" }
  )
);
