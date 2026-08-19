import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
    getMessages,
    sendChatMessage,
    clearChat
} from "../services/messageApi";
import socket from "../services/socket";

import "../styles/MessagePage.css";


function MessagePage() {

    const location = useLocation();

    const { profile } = location.state;

    const token =
        localStorage.getItem("token");

    const storedUser =
        localStorage.getItem("user");

    const loggedInUser =
        storedUser
            ? JSON.parse(storedUser)
            : null;


    const [message, setMessage] =
        useState("");

    const [messages, setMessages] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    const loggedInUserId =
        loggedInUser?.id;

    const receiverId =
        profile?.id;

    const [showChatMenu, setShowChatMenu] =
        useState(false);


    useEffect(() => {

        if (!loggedInUserId) {
            return;
        }


        socket.auth = {
            userId: loggedInUserId
        };


        socket.connect();


        socket.on("connect", () => {

            console.log(
                "Socket connected:",
                socket.id
            );

            console.log(
                "Logged-in user:",
                loggedInUserId
            );

        });


        // ======================================
        // RECEIVE REAL-TIME MESSAGE
        // ======================================

        socket.on(
            "receive_message",
            (newMessage) => {

                console.log(
                    "New message received:",
                    newMessage
                );


                // Only add if this message belongs
                // to the currently opened chat

                if (
                    newMessage.sender_id === receiverId &&
                    newMessage.receiver_id === loggedInUserId
                ) {

                    setMessages(
                        (previousMessages) => [
                            ...previousMessages,
                            newMessage
                        ]
                    );

                }

            }
        );


        socket.on("disconnect", () => {

            console.log(
                "Socket disconnected"
            );

        });


        socket.on(
            "connect_error",
            (error) => {

                console.error(
                    "Socket connection error:",
                    error
                );

            }
        );


        return () => {

            socket.off("connect");

            socket.off("receive_message");

            socket.off("disconnect");

            socket.off("connect_error");

            socket.disconnect();

        };

    }, [
        loggedInUserId,
        receiverId
    ]);


    useEffect(() => {

        const loadMessages = async () => {

            try {

                setLoading(true);

                const data =
                    await getMessages(
                        receiverId,
                        token
                    );

                setMessages(data);

            } catch (error) {

                console.error(
                    "Failed to load messages:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        if (
            receiverId &&
            token
        ) {

            loadMessages();

        }

    }, [receiverId, token]);


    // --------------------------------------
    // Send message
    // --------------------------------------

    const handleSendMessage = async () => {

        if (
            message.trim() === ""
        ) {
            return;
        }


        if (!loggedInUserId) {

            console.error(
                "Logged-in user not found"
            );

            return;

        }


        try {

            const response =
                await sendChatMessage(
                    receiverId,
                    message,
                    token
                );


            setMessages(
                (previousMessages) => [
                    ...previousMessages,
                    response.data
                ]
            );


            setMessage("");

        } catch (error) {

            console.error(
                "Failed to send message:",
                error
            );

        }

    };


    // --------------------------------------
    // Clear chat
    // --------------------------------------

    const handleClearChat = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to clear this chat?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await clearChat(
                receiverId,
                token
            );


            // Empty chat only for
            // the logged-in user

            setMessages([]);

        } catch (error) {

            console.error(
                "Failed to clear chat:",
                error
            );

        }

    };


    // --------------------------------------
    // UI
    // --------------------------------------

    return (

        <div className="message-page">


            {/* Header */}

            <div className="chat-header">

                <img
                    src={profile.profile_picture}
                    alt={profile.name}
                    className="chat-profile-image"
                />

                <h2>
                    {profile.name}
                </h2>


                <div className="chat-menu-container">

                    <button
                        className="chat-menu-button"

                        onClick={() =>
                            setShowChatMenu(
                                (previous) =>
                                    !previous
                            )
                        }

                    >
                        ⋮
                    </button>


                    {showChatMenu && (

                        <div className="chat-menu">

                            <button
                                onClick={
                                    handleClearChat
                                }
                            >
                                Clear Chat
                            </button>

                        </div>

                    )}

                </div>

            </div>


            {/* Messages */}

            <div className="chat-body">

                {loading ? (

                    <p>
                        Loading messages...
                    </p>

                ) : messages.length === 0 ? (

                    <p>
                        No messages yet.
                    </p>

                ) : (

                    messages.map((item) => (

                        <div
                            key={item.id}
                            className={
                                item.sender_id === loggedInUserId
                                    ? "message-bubble sent"
                                    : "message-bubble received"
                            }
                        >
                            {item.message}
                        </div>

                    ))

                )}

            </div>


            {/* Input */}

            <div className="chat-input-container">

                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter"
                        ) {

                            handleSendMessage();

                        }

                    }}
                />

                <button
                    onClick={handleSendMessage}
                >
                    Send
                </button>

            </div>

        </div>

    );

}


export default MessagePage;