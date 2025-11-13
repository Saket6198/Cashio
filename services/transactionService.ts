import { BASE_URL } from "@/constants";
import axios from "axios";

export const createTransaction = async (transactionData: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/newTransaction`,
      transactionData
    );
    console.log("Transaction created with response:", response.data);
    return response.data;
  } catch (err: any) {
    console.log("Error creating transaction:", err);
    throw err;
  }
};
