import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { updateProfile } from "../services/profileApi";

import "../styles/UpdateProfilePage.css";

function UpdateProfilePage({ loggedInUser }) {

    const navigate = useNavigate();

    const [about, setAbout] = useState(
        loggedInUser?.about || ""
    );

    const [education, setEducation] = useState(
        loggedInUser?.education || ""
    );

    const [skill, setSkill] = useState("");
    const [skills, setSkills] = useState([]);

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [duration, setDuration] = useState("");

    const [experience, setExperience] = useState([]);


    // -------------------------
    // Add Skill
    // -------------------------

    const addSkill = () => {

        if (skill.trim() === "") {
            return;
        }

        setSkills([
            ...skills,
            skill
        ]);

        setSkill("");
    };


    // -------------------------
    // Add Experience
    // -------------------------

    const addExperience = () => {

        if (
            company.trim() === "" ||
            role.trim() === "" ||
            duration.trim() === ""
        ) {
            return;
        }

        setExperience([
            ...experience,
            {
                company,
                role,
                duration
            }
        ]);

        setCompany("");
        setRole("");
        setDuration("");
    };


    // -------------------------
    // Save Profile
    // -------------------------

    const handleSave = async () => {

        try {

            const response = await updateProfile(
                loggedInUser.id,
                {
                    about,
                    education,
                    skills,
                    experience
                }
            );

            alert(response.message);

            navigate("/home");

        }

        catch (error) {

            console.log(error);

            if (error.response) {

                alert(
                    error.response.data.message
                );

            } else {

                alert("Profile update failed");

            }

        }

    };


    if (!loggedInUser) {

        return (
            <h2>
                Loading...
            </h2>
        );

    }


    return (

        <div className="update-profile-page">

            <div className="update-profile-card">

                <h1>
                    Update Profile
                </h1>


                {/* About */}

                <label>
                    About
                </label>

                <textarea
                    value={about}
                    onChange={(e) =>
                        setAbout(e.target.value)
                    }
                    placeholder="Tell something about yourself"
                    rows="5"
                />


                {/* Education */}

                <label>
                    Education
                </label>

                <input
                    type="text"
                    value={education}
                    onChange={(e) =>
                        setEducation(e.target.value)
                    }
                    placeholder="Education"
                />


                {/* Skills */}

                <label>
                    Skill
                </label>

                <div className="input-row">

                    <input
                        type="text"
                        placeholder="Enter Skill"
                        value={skill}
                        onChange={(e) =>
                            setSkill(e.target.value)
                        }
                    />

                    <button
                        className="add-button"
                        onClick={addSkill}
                    >
                        Add Skill
                    </button>

                </div>


                {/* Current Skills */}

                <h2 className="sub-heading">
                    Current Skills
                </h2>

                <div className="skills-list">

                    {skills.map((item, index) => (

                        <div
                            key={index}
                            className="skill-item"
                        >
                            • {item}
                        </div>

                    ))}

                </div>


                {/* Experience */}

                <h2 className="experience-heading">
                    Experience
                </h2>


                <label>
                    Company
                </label>

                <input
                    type="text"
                    placeholder="Company Name"
                    value={company}
                    onChange={(e) =>
                        setCompany(e.target.value)
                    }
                />


                <label>
                    Role
                </label>

                <input
                    type="text"
                    placeholder="Role"
                    value={role}
                    onChange={(e) =>
                        setRole(e.target.value)
                    }
                />


                <label>
                    Duration
                </label>

                <input
                    type="text"
                    placeholder="2023 - Present"
                    value={duration}
                    onChange={(e) =>
                        setDuration(e.target.value)
                    }
                />


                <button
                    className="add-button full-button"
                    onClick={addExperience}
                >
                    Add Experience
                </button>


                {/* Current Experience */}

                <h2 className="sub-heading">
                    Current Experience
                </h2>

                <div className="experience-list">

                    {experience.map((item, index) => (

                        <div
                            key={index}
                            className="experience-item"
                        >

                            <strong>
                                {item.company}
                            </strong>

                            <p>
                                {item.role}
                            </p>

                            <p>
                                {item.duration}
                            </p>

                        </div>

                    ))}

                </div>


                {/* Save */}

                <button
                    className="save-button"
                    onClick={handleSave}
                >
                    Save
                </button>

            </div>

        </div>

    );

}

export default UpdateProfilePage;
