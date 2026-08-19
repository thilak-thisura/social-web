import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterAdminPage from "../pages/RegisterAdminPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import CreateUserPage from "../pages/CreateUserPage";
import ViewUsersPage from "../pages/ViewUsersPage";
import HomePage from "../pages/HomePage";
import ProfileDetailPage from "../pages/ProfileDetailPage";
import UpdateProfilePage from "../pages/UpdateProfilePage";
import MessagePage from "../pages/MessagePage";
import TrackPage from "../pages/TrackPage";
import ChatPage from "../pages/ChatPage";
import RehabilitationUsers from "../pages/RehabilitationUsers";
import RehabilitationHistory from "../pages/RehabilitationHistory";

function AppRouter({
    users,
    setUsers,
    loggedInUser,
    setLoggedInUser,
}) {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <LoginPage
                            setLoggedInUser={setLoggedInUser}
                        />
                    }
                />

                <Route
                    path="/register-admin"
                    element={<RegisterAdminPage />}
                />

                <Route
                    path="/admin-dashboard"
                    element={<AdminDashboardPage />}
                />

                <Route
                    path="/create-user"
                    element={<CreateUserPage />}
                />

                <Route
                    path="/view-users"
                    element={<ViewUsersPage />}
                />

                <Route
                    path="/rehabilitation"
                    element={
                        <RehabilitationUsers />
                    }
                />

                <Route
                    path="/rehabilitation/:userId"
                    element={
                        <RehabilitationHistory />
                    }
                />

                <Route
                    path="/home"
                    element={
                        <HomePage
                            users={users}
                            setUsers={setUsers}
                            loggedInUser={loggedInUser}
                            setLoggedInUser={setLoggedInUser}
                        />
                    }
                />

                <Route
                    path="/chat"
                    element={<ChatPage />}
                />

                <Route
                    path="/update-profile"
                    element={
                        <UpdateProfilePage
                            loggedInUser={loggedInUser}
                            setLoggedInUser={setLoggedInUser}
                        />
                    }
                />

                <Route
                    path="/track"
                    element={
                        <TrackPage />
                    }
                />

                <Route
                    path="/profile-details"
                    element={
                        <ProfileDetailPage
                            users={users}
                            setUsers={setUsers}
                            loggedInUser={loggedInUser}
                        />
                    }
                />

                <Route
                    path="/message"
                    element={<MessagePage />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRouter;