import axios from "axios";

const API_URL = "http://localhost:5000";

export const getImageUrl = (image) => {

    if (!image) {
        return "";
    }

    if (image.startsWith("http")) {
        return image;
    }

    return `${API_URL}${image}`;

};

export const createUser = async (userData) => {

    const token =
        localStorage.getItem("token");

    const response =
        await axios.post(
            `${API_URL}/users`,
            userData,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    return response.data;
};


export const getAllUsers = async () => {

    const token =
        localStorage.getItem("token");

    const response =
        await axios.get(
            `${API_URL}/users`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    return response.data;
};


export const getUsers = async (loggedInUserId) => {

    const response =
        await axios.get(
            `${API_URL}/users/${loggedInUserId}`
        );

    return response.data.map((user) => ({
        ...user,
        profile_picture:
            getImageUrl(user.profile_picture)
    }));

};


export const updateProfile = async (
    userId,
    profileData
) => {

    const token =
        localStorage.getItem("token");

    const response =
        await axios.put(
            `${API_URL}/users/${userId}`,
            profileData,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    return response.data;
};


export const updateProfilePicture = async (imageFile) => {

    const token =
        localStorage.getItem("token");

    const formData =
        new FormData();

    formData.append(
        "profile_picture",
        imageFile
    );

    const response =
        await axios.put(
            `${API_URL}/users/profile-picture`,
            formData,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    return response.data;
};