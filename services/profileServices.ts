import { BASE_URL } from "@/constants";
import { SettingsType } from "@/schema/settingsSchema";
import axios from "axios";

export type ProfileSettingsHistoryItem = {
  _id: string;
  year: number;
  month: number;
  monthLabel: string;
  rentAmount: number;
  previous_month_balance: number;
  gstAmount: number;
  vatAmount: number;
  otherCharges: number;
  grandTotal: number;
  note: string;
  fineActive: boolean;
  finePerDay: number;
  fineStartDate?: string;
  fineEndDate?: string;
  createdAt: string;
};

export type ProfileSettingsHistoryPeriod = {
  year: number;
  month: number;
  monthLabel: string;
};

export type ProfileSettingsHistoryResponse = {
  history: ProfileSettingsHistoryItem[];
  availablePeriods: ProfileSettingsHistoryPeriod[];
};

export const fetchAllProfiles = async () => {
  console.log("Fetching all profiles from server...");
  try {
    const response = await axios.get(`${BASE_URL}/user/profiles`);
    console.log("Fetched profiles:", response.data);
    return response?.data;
  } catch (error: any) {
    console.error(
      "Error fetching profiles:",
      error?.response?.data || error.message,
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
  profileData: SettingsType,
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/user/profile/update/${profileId}`,
      profileData,
    );
    return response?.data;
  } catch (err: any) {
    console.log("Error updating profile:", err);
    throw err;
  }
};

export const fetchProfileSettingsHistory = async (
  profileId: string,
): Promise<ProfileSettingsHistoryResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/profile/settings-history/${profileId}`,
    );
    return {
      history: response?.data?.history || [],
      availablePeriods: response?.data?.availablePeriods || [],
    };
  } catch (err: any) {
    console.log("Error fetching profile settings history:", err);
    throw err;
  }
};

export const fetchProfileSettingsByMonthYear = async (
  profileId: string,
  year: number,
  month: number,
): Promise<ProfileSettingsHistoryItem | null> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/profile/settings-history/${profileId}/${year}/${month}`,
    );
    return response?.data?.history || null;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      console.warn(
        `No profile settings found for ${profileId} ${month}/${year}, returning null.`,
      );
      return null;
    }

    console.log("Error fetching profile settings history:", err);
    throw err;
  }
};
