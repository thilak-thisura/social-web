import axios from "axios";

const API_URL = "http://localhost:5000";

export const registerAdmin = async (adminData) => {
  const response = await axios.post(
    `${API_URL}/auth/register-admin`,
    adminData
  );

  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    userData
  );

  return response.data;
};