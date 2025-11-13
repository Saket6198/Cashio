import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useProfileStore = create(
  persist(
    (set) => ({
      activeProfile: null,
      setActiveProfile: (profile: any) => set({ activeProfile: profile }),
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
