import { calculateAngle } from "../utils/calculateAngle";

export function evaluateLeftArm(landmarks) {

    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftWrist = landmarks[15];

    if (
        !leftShoulder ||
        !leftElbow ||
        !leftWrist ||
        leftShoulder.visibility < 0.6 ||
        leftElbow.visibility < 0.6 ||
        leftWrist.visibility < 0.6
    ) {
        return {
            detected: false,
            angle: null,
            score: "Left Arm not detected",
            color: "#a71100"
        };
    }

    const angle = calculateAngle(
        leftShoulder,
        leftElbow,
        leftWrist
    );

    return {
        detected: true,
        angle,
        ...evaluateLeftArmScore(angle)
    };
}


export function evaluateLeftArmScore(angle) {

    if (angle >= 170) {
        return {
            score: "Good",
            color: "#2ecc71"
        };
    }

    if (angle >= 140) {
        return {
            score: "Medium",
            color: "#f39c12"
        };
    }

    return {
        score: "Low",
        color: "#e74c3c"
    };
}