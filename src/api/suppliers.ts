import axios from "axios";
import { baseURL } from "./auth";

export const getSupplierList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/supplier/list`, {
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

export const createSupplier = async (data: any, token: any) => {
  try {
    const res = await axios.post(`${baseURL}/supplier`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateSupplier = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/supplier?uuid=${data.uuid}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSupplier = async (uuid: any, token: string) => {
  try {
    const res = await axios.delete(`${baseURL}/supplier?uuid=${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
