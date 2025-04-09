import axios from "axios";
import { baseURL } from "./auth";

export const getEmailReward = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/system-setting/email-reward`, {
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

export const addEmailReward = async (data: any, token: any) => {
  try {
    const res = await axios.post(
      `${baseURL}/system-setting/email-reward`,
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

export const updateEmailReward = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/system-setting/email-reward`,
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

// withdraw thershold
export const getWithdrawThreshold = async (token: string) => {
  try {
    const res = await axios.get(
      `${baseURL}/system-setting/withdrawal-threshold`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const addWithdrawThreshold = async (data: any, token: any) => {
  try {
    const res = await axios.post(
      `${baseURL}/system-setting/withdrawal-threshold`,
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

export const updateWithdrawThreshold = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/system-setting/withdrawal-threshold`,
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

// signup bonus
export const getSignupBonus = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/system-setting/signup-bonus`, {
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

export const addSignupBonus = async (data: any, token: any) => {
  try {
    const res = await axios.post(
      `${baseURL}/system-setting/signup-bonus`,
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

export const updateSignupBonus = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/system-setting/signup-bonus`,
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

// referral bonus
export const getReferralBonus = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/system-setting/referral-bonus`, {
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

export const addReferralBonus = async (data: any, token: any) => {
  try {
    const res = await axios.post(
      `${baseURL}/system-setting/referral-bonus`,
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

export const updateReferralBonus = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/system-setting/referral-bonus`,
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
