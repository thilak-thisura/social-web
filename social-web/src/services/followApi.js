import axios from "axios";

const API_URL = "http://localhost:5000";

export const followUser = async (
  followerId,
  followingId
) => {
  const response = await axios.post(
    `${API_URL}/follow`,
    {
      followerId,
      followingId,
    }
  );

  return response.data;
};

export const unfollowUser = async (
  followerId,
  followingId
) => {
  const response = await axios.delete(
    `${API_URL}/follow`,
    {
      data: {
        followerId,
        followingId,
      },
    }
  );

  return response.data;
};