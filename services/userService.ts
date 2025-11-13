import { BASE_URL } from "@/constants";
import { NewProfileType } from "@/schema/newProfileSchema";
import axios from "axios";

export const createProfile = async (profileData: NewProfileType) => {
  try {
    console.log("Creating profile with data:", profileData);
    const response = await axios.post(`${BASE_URL}/user/create`, profileData);
    return response.data;
  } catch (err: any) {
    console.log("Error creating profile:", err.response?.data || err.message);
    throw err;
  }
};
