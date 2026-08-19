import axios from "axios";

const API_URL = "http://localhost:5000";

export const updateProfile = async (
  userId,
  profileData
) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/users/${userId}`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};