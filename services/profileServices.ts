import { BASE_URL } from "@/constants";
import { SettingsType } from "@/schema/settingsSchema";
import axios from "axios";

export const fetchAllProfiles = async () => {
  console.log("Fetching all profiles from server...");
  try {
    const response = await axios.get(`${BASE_URL}/user/profiles`);
    console.log("Fetched profiles:", response.data);
    return response?.data;
  } catch (error) {
    console.error(
      "Error fetching profiles:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

export const fetchProfileById = async (profileId: any) => {
  console.log(`Fetching profile with ID: ${profileId} from server...`);
  try {
    const response = await axios.get(`${BASE_URL}/user/profile/${profileId}`);
    return response?.data?.profile;
  } catch (err: any) {
    console.log("Error fetching profile by ID:", err);
    throw err;
  }
};

export const updateProfile = async (
  profileId: any,
  profileData: SettingsType
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/user/profile/update/${profileId}`,
      profileData
    );
    return response?.data;
  } catch (err: any) {
    console.log("Error updating profile:", err);
    throw err;
  }
};
