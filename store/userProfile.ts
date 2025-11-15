import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProfileStore {
  activeProfile: string | null;
  profileName: string | null;
  setActiveProfile: (profileId: any) => void;
  setProfileName: (name: string) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      activeProfile: null,
      profileName: null,
      setActiveProfile: (profile: any) => set({ activeProfile: profile }),
      setProfileName: (name: string) => set({ profileName: name }),
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
