import { NewProfileType } from "@/schema/newProfileSchema";
import { updateProfile } from "@/services/profileServices";
import { createProfile } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsType } from "../schema/settingsSchema";

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData: NewProfileType) => {
      return await createProfile(profileData);
    },
    onSuccess: (data) => {
      console.log("Profile created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
    onError: (error) => {
      console.error("Error creating profile:", error);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.profileId],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile-settings-history", variables.profileId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "profile-settings-history-month-year",
          variables.profileId,
          variables.profileData.year,
          variables.profileData.month,
        ],
      });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });
};
