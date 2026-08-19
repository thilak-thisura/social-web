import { useNavigate, useLocation } from "react-router-dom";
import { followUser, unfollowUser } from "../services/followApi";
import "../styles/ProfileDetailPage.css";

function ProfileDetailPage({
  users,
  setUsers,
  loggedInUser,
}) {

  const navigate = useNavigate();
  const location = useLocation();

  const profileID = location.state.user.id;

  const profile = users.find(
    user => user.id === profileID
  );

  const handleFollow = async () => {

    try {

      if (profile.isFollowing) {

        await unfollowUser(
          loggedInUser.id,
          profile.id
        );

      } else {

        await followUser(
          loggedInUser.id,
          profile.id
        );

      }

      setUsers(prevUsers =>

        prevUsers.map(user =>

          user.id === profile.id

            ? {

              ...user,

              isFollowing: !user.isFollowing,

              followers: user.isFollowing
                ? user.followers - 1
                : user.followers + 1

            }

            : user

        )

      );

    } catch (error) {

      console.log(error);

    }

  };

  if (!profile) {

    return <h2>User Not Found</h2>;

  }

  return (

    <div className="profile-page">

      <div className="profile-header">

        <img
          src={profile.profile_picture}
          alt={profile.name}
        />

        <div>

          <h2>{profile.name}</h2>

          <h3>{profile.role}</h3>

          <p>{profile.location}</p>

          <div className="stats">

            <div>

              <h2>{profile.followers}</h2>

              <p>Followers</p>

            </div>

            <div>

              <h2>{profile.following}</h2>

              <p>Following</p>

            </div>

          </div>

          <div className="buttons">

            <button
              className={
                profile.isFollowing
                  ?
                  "following-btn"
                  :
                  "follow-btn"
              }
              onClick={handleFollow}
            >

              {profile.isFollowing
                ?
                "Following"
                :
                "Follow"}

            </button>

            <button
              className="message-btn"
              onClick={() =>
                navigate("/message", {
                  state: { profile }
                })
              }
            >

              Message

            </button>

          </div>

        </div>

      </div>

      <div className="section">

        <h2>About</h2>

        <p>{profile.about}</p>

      </div>

      <div className="section">

        <h2>Skills</h2>

        <ul>

          {profile.skills.map((skill, index) => (

            <li key={index}>
              {skill}
            </li>

          ))}

        </ul>

      </div>

      <div className="section">

        <h2>Experience</h2>

        {

          profile.experience.map((exp, index) => (

            <div
              key={index}
              className="experience"
            >

              <h3>{exp.company}</h3>

              <p>{exp.role}</p>

              <p>{exp.duration}</p>

            </div>

          ))

        }

      </div>

      <div className="section">

        <h2>Education</h2>

        <p>{profile.education}</p>

      </div>

      <div className="section">

        <h2>Contact</h2>

        <p>{profile.email}</p>

      </div>

    </div>

  );

}

export default ProfileDetailPage;