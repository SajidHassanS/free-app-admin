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

export const getDuplicateEmailsList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/email/duplicate/all`, {
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

export const getEmailsStats = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/email/stats`, {
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

export const emailBulkUpdate = async (data: any, token: string) => {
  try {
    const res = await axios.patch(`${baseURL}/email/bulk-update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
