import axios from "axios";

export const baseURL =
  "https://bw1ooodjzb.execute-api.eu-north-1.amazonaws.com/admin/api";
// export const baseURL =
//   "https://6de4-2402-e000-429-7336-d03f-f6dd-418d-4fe7.ngrok-free.app/api";
// export const baseURL = "http://192.168.200.46:7001/api";

export const createAccount = async (data: createAccountPayload) => {
  try {
    const res = await axios.post(`${baseURL}/admin/auth/signup`, data);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const login = async (data: any) => {
  try {
    const res = await axios.post(`${baseURL}/admin/auth/login`, data);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateUserAccountPassword = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/admin/auth/password/update`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

// get  profile
export const getUserProfile = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/admin/profile`, {
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

// update  profile
export const updateUserProfile = async (data: any, token: string) => {
  try {
    const res = await axios.patch(`${baseURL}/admin/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
