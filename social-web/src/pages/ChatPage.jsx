import { useEffect, useState } from "react";

import { getChatList } from "../services/chatApi";

import socket from "../services/socket";

import {
    getMessages,
    sendChatMessage,
    clearChat,
    markMessagesAsRead
} from "../services/messageApi";

import { getImageUrl } from "../services/usersApi";

import "../styles/ChatPage.css";


function ChatPage() {

    const token =
        localStorage.getItem("token");

    const storedUser =
        localStorage.getItem("user");

    const loggedInUser =
        storedUser
            ? JSON.parse(storedUser)
            : null;

    const loggedInUserId =
        loggedInUser?.id;


    const [chats, setChats] =
        useState([]);

    const [selectedChat, setSelectedChat] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [messagesLoading, setMessagesLoading] =
        useState(false);

    const [showChatMenu, setShowChatMenu] =
        useState(false);


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    const handleSendMessage = async () => {

        if (
            message.trim() === "" ||
            !selectedChat ||
            !token
        ) {
            return;
        }


        try {

            const response =
                await sendChatMessage(
                    selectedChat.id,
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

    // ==========================================
    // SOCKET.IO REAL-TIME MESSAGES
    // ==========================================

    useEffect(() => {

        if (!loggedInUserId) {
            return;
        }


        // Give Socket.IO the logged-in user's ID

        socket.auth = {
            userId: loggedInUserId
        };


        // Connect socket

        socket.connect();


        // Receive new message

        const handleReceiveMessage = (newMessage) => {

            console.log(
                "Real-time message received:",
                newMessage
            );


            // Check whether this message
            // belongs to the currently open chat

            const isCurrentChat =
                selectedChat &&
                (
                    (
                        newMessage.sender_id ===
                        selectedChat.id
                    )
                    ||
                    (
                        newMessage.receiver_id ===
                        selectedChat.id
                    )
                );


            if (isCurrentChat) {

                setMessages(
                    (previousMessages) => {

                        // Prevent duplicate messages

                        const alreadyExists =
                            previousMessages.some(
                                (item) =>
                                    item.id ===
                                    newMessage.id
                            );


                        if (alreadyExists) {
                            return previousMessages;
                        }


                        return [
                            ...previousMessages,
                            newMessage
                        ];

                    }
                );

            }

        };


        socket.on(
            "receive_message",
            handleReceiveMessage
        );


        return () => {

            socket.off(
                "receive_message",
                handleReceiveMessage
            );

        };

    }, [
        loggedInUserId,
        selectedChat
    ]);


    // ==========================================
    // CLEAR CHAT
    // ==========================================

    const handleClearChat = async () => {

        if (
            !selectedChat ||
            !token
        ) {
            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to clear this chat?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await clearChat(
                selectedChat.id,
                token
            );


            // Clear messages only
            // from logged-in user's view

            setMessages([]);


            // Close three-dot menu

            setShowChatMenu(false);

        } catch (error) {

            console.error(
                "Failed to clear chat:",
                error
            );

        }

    };


    // ==========================================
    // LOAD CHAT LIST
    // ==========================================

    useEffect(() => {

        const loadChats = async () => {

            try {

                const data =
                    await getChatList(token);

                setChats(data);

            } catch (error) {

                console.error(
                    "Failed to load chats:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        if (token) {
            loadChats();
        }

    }, [token]);


    // ==========================================
    // LOAD MESSAGES
    // ==========================================

    useEffect(() => {

        const loadMessages = async () => {

            if (
                !selectedChat ||
                !token
            ) {
                return;
            }


            try {

                setMessagesLoading(true);


                const data =
                    await getMessages(
                        selectedChat.id,
                        token
                    );


                setMessages(data);


                // Mark received messages
                // as read

                await markMessagesAsRead(
                    selectedChat.id,
                    token
                );

            } catch (error) {

                console.error(
                    "Failed to load messages:",
                    error
                );


                setMessages([]);

            } finally {

                setMessagesLoading(false);

            }

        };


        loadMessages();

    }, [selectedChat, token]);


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="chat-page">


            {/* ==================================
                LEFT SIDE
            ================================== */}

            <aside className="chat-list">

                <h2>
                    Chats
                </h2>


                {loading ? (

                    <p>
                        Loading chats...
                    </p>

                ) : chats.length === 0 ? (

                    <p>
                        No conversations yet.
                    </p>

                ) : (

                    chats.map((chat) => (

                        <div
                            key={chat.id}

                            className={
                                selectedChat?.id === chat.id
                                    ? "chat-list-item active"
                                    : "chat-list-item"
                            }

                            onClick={() => {

                                setSelectedChat(chat);

                                setShowChatMenu(false);

                            }}

                        >

                            <img
                                src={getImageUrl(
                                    chat.profile_picture
                                )}

                                alt={chat.name}

                                className="chat-list-image"
                            />


                            <div className="chat-list-info">

                                <h3>
                                    {chat.name}
                                </h3>

                            </div>

                        </div>

                    ))

                )}

            </aside>


            {/* ==================================
                RIGHT SIDE
            ================================== */}

            <main className="chat-window">


                {!selectedChat ? (

                    <div className="no-chat-selected">

                        <h2>
                            Select a chat
                        </h2>

                        <p>
                            Select someone from your
                            conversations to start chatting.
                        </p>

                    </div>

                ) : (

                    <div className="active-chat">


                        {/* ==========================
                            CHAT HEADER
                        ========================== */}

                        <div className="active-chat-header">


                            {/* Profile image */}

                            <img
                                src={getImageUrl(
                                    selectedChat.profile_picture
                                )}

                                alt={selectedChat.name}

                                className="active-chat-image"
                            />


                            {/* User name */}

                            <h2>
                                {selectedChat.name}
                            </h2>


                            {/* Three dot menu */}

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


                        {/* ==========================
                            MESSAGES
                        ========================== */}

                        <div className="active-chat-body">

                            {messagesLoading ? (

                                <p>
                                    Loading messages...
                                </p>

                            ) : messages.length === 0 ? (

                                <p className="no-messages">
                                    No messages yet.
                                </p>

                            ) : (

                                messages.map((item) => (

                                    <div
                                        key={item.id}

                                        className={
                                            item.sender_id ===
                                                loggedInUserId
                                                ? "message-bubble sent"
                                                : "message-bubble received"
                                        }
                                    >

                                        {item.message}

                                    </div>

                                ))

                            )}

                        </div>


                        {/* ==========================
                            MESSAGE INPUT
                        ========================== */}

                        <div className="active-chat-input">

                            <input
                                type="text"

                                placeholder={
                                    `Message ${selectedChat.name}...`
                                }

                                value={message}

                                onChange={(e) =>
                                    setMessage(
                                        e.target.value
                                    )
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
                                onClick={
                                    handleSendMessage
                                }
                            >
                                Send
                            </button>

                        </div>

                    </div>

                )}

            </main>

        </div>

    );

}


export default ChatPage;