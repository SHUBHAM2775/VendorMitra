import API from "../api/axios";
const API_BASE = "/users";

export const getVerificationStatusById = async (userId) => {
  const res = await API.get(`${API_BASE}/verification-status/${userId}`);
  return res.data;
};
