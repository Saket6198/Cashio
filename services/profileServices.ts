import { BASE_URL } from "@/constants";
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
