import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProfileStore {
  activeProfile: string | null;
  profileName: string | null;
  selectedMonth: number | null;
  selectedYear: number | null;
  setActiveProfile: (profileId: any) => void;
  setProfileName: (name: string) => void;
  setSelectedPeriod: (month: number, year: number) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      activeProfile: null,
      profileName: null,
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      setActiveProfile: (profile: any) => set({ activeProfile: profile }),
      setProfileName: (name: string) => set({ profileName: name }),
      setSelectedPeriod: (month: number, year: number) =>
        set({ selectedMonth: month, selectedYear: year }),
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
