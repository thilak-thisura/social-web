import {
    useEffect,
    useRef,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import socket from "../services/socket";

import "../styles/HomePage.css";

import {
    followUser,
    unfollowUser,
} from "../services/followApi";

import {
    updateProfilePicture,
    getImageUrl
} from "../services/usersApi";

import {
    getUnreadMessageCount
} from "../services/messageApi";


function HomePage({
    users,
    setUsers,
    loggedInUser,
    setLoggedInUser,
}) {

    const navigate = useNavigate();

    const videoRef = useRef(null);

    const [showMenu, setShowMenu] = useState(false);

    const [showImageMenu, setShowImageMenu] = useState(false);

    const [uploadingImage, setUploadingImage] = useState(false);

    const [showCamera, setShowCamera] = useState(false);

    const [cameraStream, setCameraStream] = useState(null);

    const [unreadCount, setUnreadCount] = useState(0);


    const openCamera = async () => {

        try {

            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {

                alert(
                    "Camera is not supported by this browser."
                );

                return;
            }

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "user"
                    },
                    audio: false
                });

            setCameraStream(stream);

            setShowCamera(true);

            setShowImageMenu(false);

        } catch (error) {

            console.error(
                "Camera error:",
                error
            );

            if (error.name === "NotAllowedError") {

                alert(
                    "Camera permission was denied. Please allow camera access in your browser."
                );

            } else if (error.name === "NotFoundError") {

                alert(
                    "No camera was found on this device."
                );

            } else {

                alert(
                    "Unable to open camera."
                );

            }

        }

    };

    const loadUnreadCount = async () => {

        const token =
            localStorage.getItem("token");


        if (!token) {
            return;
        }


        try {

            const data =
                await getUnreadMessageCount(
                    token
                );

            setUnreadCount(
                data.unreadCount
            );

        } catch (error) {

            console.error(
                "Failed to load unread message count:",
                error
            );

        }

    };

    useEffect(() => {

        loadUnreadCount();

    }, []);

    useEffect(() => {

        const token =
            localStorage.getItem("token");


        if (!token) {
            return;
        }


        socket.auth = {
            userId: loggedInUser?.id
        };


        socket.connect();


        socket.on(
            "new_message_notification",
            () => {

                loadUnreadCount();

            }
        );


        return () => {

            socket.off(
                "new_message_notification"
            );

            socket.disconnect();

        };

    }, [loggedInUser]);


    useEffect(() => {

        if (
            showCamera &&
            cameraStream &&
            videoRef.current
        ) {

            const video = videoRef.current;

            video.srcObject = cameraStream;

            video.onloadedmetadata = () => {
                video.play();
            };

        }

    }, [showCamera, cameraStream]);


    const closeCamera = () => {

        if (cameraStream) {

            cameraStream
                .getTracks()
                .forEach((track) => {
                    track.stop();
                });

        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setCameraStream(null);

        setShowCamera(false);

    };


    const handleFollow = async (selectedUser) => {

        try {

            if (selectedUser.isFollowing) {

                await unfollowUser(
                    loggedInUser.id,
                    selectedUser.id
                );

            } else {

                await followUser(
                    loggedInUser.id,
                    selectedUser.id
                );

            }

            setUsers((prevUsers) =>

                prevUsers.map((user) => {

                    if (user.id !== selectedUser.id) {
                        return user;
                    }

                    return {

                        ...user,

                        isFollowing:
                            !user.isFollowing,

                        followers:
                            user.isFollowing
                                ? user.followers - 1
                                : user.followers + 1,

                    };

                })

            );

        } catch (error) {

            console.log(error);

        }

    };


    const uploadImage = async (file) => {

        try {

            setUploadingImage(true);

            const response =
                await updateProfilePicture(file);

            const imageUrl =
                getImageUrl(response.profile_picture);

            const updatedUser = {

                ...loggedInUser,

                profile_picture: imageUrl

            };

            setLoggedInUser(updatedUser);

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            alert(
                "Profile picture updated successfully"
            );

        } catch (error) {

            console.error(
                "Profile image upload error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update profile picture"
            );

        } finally {

            setUploadingImage(false);

        }

    };


    const handleImageChange = async (event) => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        await uploadImage(file);

        setShowImageMenu(false);

        event.target.value = "";

    };


    const capturePhoto = () => {

        const video =
            videoRef.current;

        if (!video) {
            return;
        }

        const canvas =
            document.createElement("canvas");

        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;

        const context =
            canvas.getContext("2d");

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob(
            async (blob) => {

                if (!blob) {
                    return;
                }

                const file =
                    new File(
                        [blob],
                        "profile-picture.jpg",
                        {
                            type: "image/jpeg"
                        }
                    );

                closeCamera();

                await uploadImage(file);

            },
            "image/jpeg",
            0.9
        );

    };


    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");

    };


    function handleTrack() {

        navigate("/track");

    }


    if (!loggedInUser) {

        return <h2>Loading...</h2>;

    }


    return (

        <div className="home">

            <header className="home-navbar">

                <div className="navbar-title">
                    Social Web
                </div>

                <button
                    className="chat-nav-btn"
                    onClick={() => navigate("/chat")}
                    title="Messages"
                >
                    💬

                    {unreadCount > 0 && (

                        <span className="chat-notification-badge">
                            {unreadCount > 99
                                ? "99+"
                                : unreadCount}
                        </span>

                    )}

                </button>

            </header>


            <div className="home-container">

                <aside className="home-sidebar">

                    <div className="profile-image-container">

                        <img
                            src={getImageUrl(loggedInUser.profile_picture)}
                            alt={loggedInUser.name}
                            className="profile-image"
                            onClick={() =>
                                setShowImageMenu(
                                    !showImageMenu
                                )
                            }
                        />


                        {showImageMenu &&
                            !uploadingImage && (

                                <div className="image-menu">

                                    <button
                                        type="button"
                                        onClick={openCamera}
                                    >
                                        📷 Camera
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    "gallery-input"
                                                )
                                                .click()
                                        }
                                    >
                                        🖼 Gallery
                                    </button>

                                </div>

                            )}


                        {uploadingImage && (

                            <div className="uploading-text">

                                Uploading...

                            </div>

                        )}


                        <input
                            id="gallery-input"
                            type="file"
                            accept="image/*"
                            style={{
                                display: "none"
                            }}
                            onChange={
                                handleImageChange
                            }
                        />

                    </div>


                    <h2 className="profile-name">

                        {loggedInUser.name}

                    </h2>


                    <p className="profile-role">

                        {loggedInUser.role}

                    </p>


                    <p className="profile-designation">

                        {loggedInUser.designation}

                    </p>


                    <hr />


                    <div className="profile-contact">

                        <p>
                            <strong>
                                Email
                            </strong>
                        </p>

                        <p>
                            {loggedInUser.email}
                        </p>

                        <br />

                        <p>
                            <strong>
                                Location
                            </strong>
                        </p>

                        <p>
                            {loggedInUser.location}
                        </p>

                    </div>


                    <div className="sidebar-buttons">

                        <button
                            className="update-btn"
                            onClick={() =>
                                navigate(
                                    "/update-profile"
                                )
                            }
                        >
                            Update Profile
                        </button>


                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>


                        <button
                            className="track-btn"
                            onClick={handleTrack}
                        >
                            Track
                        </button>

                    </div>

                </aside>


                <main className="home-content">

                    <h2 className="suggested-title">

                        Suggested Users

                    </h2>

                    <div className="users-grid">

                        {users.map((user) => (

                            <div
                                key={user.id}
                                className="user-card"
                                onClick={() =>
                                    navigate(
                                        "/profile-details",
                                        {
                                            state: {
                                                user
                                            }
                                        }
                                    )
                                }
                            >

                                <img
                                    src={getImageUrl(user.profile_picture)}
                                    alt={user.name}
                                    className="user-image"
                                />


                                <h3>
                                    {user.name}
                                </h3>


                                <p>
                                    {user.role}
                                </p>


                                <p>
                                    {user.designation}
                                </p>


                                <button
                                    className={
                                        user.isFollowing
                                            ? "following-btn"
                                            : "follow-btn"
                                    }
                                    onClick={(e) => {

                                        e.stopPropagation();

                                        handleFollow(user);

                                    }}
                                >

                                    {
                                        user.isFollowing
                                            ? "Following"
                                            : "Follow"
                                    }

                                </button>

                            </div>

                        ))}

                    </div>

                </main>

            </div>


            {showCamera && (

                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.85)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 99999
                    }}
                >

                    <div
                        style={{
                            width: "90%",
                            maxWidth: "600px",
                            backgroundColor: "white",
                            borderRadius: "15px",
                            padding: "20px",
                            textAlign: "center",
                            boxSizing: "border-box"
                        }}
                    >

                        <h2>
                            Take Profile Photo
                        </h2>

                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{
                                width: "100%",
                                height: "400px",
                                backgroundColor: "black",
                                borderRadius: "10px",
                                objectFit: "cover"
                            }}
                        />

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "15px",
                                marginTop: "20px"
                            }}
                        >

                            <button
                                type="button"
                                onClick={capturePhoto}
                                style={{
                                    padding: "12px 25px",
                                    border: "none",
                                    borderRadius: "8px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    fontSize: "16px",
                                    cursor: "pointer"
                                }}
                            >
                                📷 Take Photo
                            </button>

                            <button
                                type="button"
                                onClick={closeCamera}
                                style={{
                                    padding: "12px 25px",
                                    border: "none",
                                    borderRadius: "8px",
                                    backgroundColor: "#555",
                                    color: "white",
                                    fontSize: "16px",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default HomePage;