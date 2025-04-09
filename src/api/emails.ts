import axios from "axios";
import { baseURL } from "./auth";

export const getEmailsList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/email/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
