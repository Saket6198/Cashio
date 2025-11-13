import { NewProfileType } from "@/schema/newProfileSchema";
import { createProfile } from "@/services/userService";
import { useMutation } from "@tanstack/react-query";

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
