import axios from "axios";

const API_URL = "http://localhost:5000";

// Send message
export const sendChatMessage = async (
    receiverId,
    message,
    token
) => {

    const response = await axios.post(
        `${API_URL}/messages`,
        {
            receiver_id: receiverId,
            message: message
        },
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    return response.data;
};


// Get chat messages
export const getMessages = async (
    otherUserId,
    token
) => {

    const response = await axios.get(
        `${API_URL}/messages/${otherUserId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};


// Clear chat
export const clearChat = async (
    otherUserId,
    token
) => {

    const response = await axios.delete(
        `${API_URL}/messages/chat/${otherUserId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const getUnreadMessageCount = async (token) => {

    const response = await axios.get(
        `${API_URL}/messages/unread-count`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const markMessagesAsRead = async (
    otherUserId,
    token
) => {

    const response =
        await axios.put(
            `${API_URL}/messages/read/${otherUserId}`,
            {},
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    return response.data;
};