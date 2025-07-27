import API from "../api/axios";
const API_BASE = "/user";

export const getVerificationStatusById = async (userId) => {
  const res = await API.get(`${API_BASE}/verification-status/${userId}`);
  return res.data;
};
