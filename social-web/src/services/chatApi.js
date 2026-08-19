import axios from "axios";

const API_URL =
    "http://localhost:5000";


export const getChatList = async (
    token
) => {

    const response =
        await axios.get(
            `${API_URL}/messages/chats`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    return response.data;
};