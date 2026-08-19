import axios from "axios";

const API_URL = "http://localhost:5000";


export const saveRehabilitationSession = async (
    sessionData
) => {

    const token =
        localStorage.getItem("token");


    const response =
        await axios.post(
            `${API_URL}/rehabilitation/sessions`,
            sessionData,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    return response.data;

};

export const getUserRehabilitationHistory =
    async (userId) => {

        const token =
            localStorage.getItem("token");

        const response =
            await axios.get(
                `${API_URL}/rehabilitation/user/${userId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        return response.data;
    };