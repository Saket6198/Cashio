import { NewProfileType } from "@/schema/newProfileSchema";
import { updateProfile } from "@/services/profileServices";
import { createProfile } from "@/services/userService";
import { useMutation } from "@tanstack/react-query";
import { SettingsType } from "../schema/settingsSchema";

export const useCreateProfile = () => {
  return useMutation({
    mutationFn: async (profileData: NewProfileType) => {
      return await createProfile(profileData);
    },
    onSuccess: (data) => {
      console.log("Profile created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating profile:", error);
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async ({
      profileId,
      profileData,
    }: {
      profileId: any;
      profileData: SettingsType;
    }) => {
      return await updateProfile(profileId, profileData);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });
};
