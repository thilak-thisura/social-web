import { calculateAngle } from "../utils/calculateAngle";

export function evaluateRightArm(landmarks) {

    const rightShoulder = landmarks[12];
    const rightElbow = landmarks[14];
    const rightWrist = landmarks[16];

    if (
        !rightShoulder ||
        !rightElbow ||
        !rightWrist ||
        rightShoulder.visibility < 0.6 ||
        rightElbow.visibility < 0.6 ||
        rightWrist.visibility < 0.6
    ) {
        return {
            detected: false,
            angle: null,
            score: "Right Arm not detected",
            color: "#a71100"
        };
    }

    const angle = calculateAngle(
        rightShoulder,
        rightElbow,
        rightWrist
    );

    return {
        detected: true,
        angle,
        ...evaluateRightArmScore(angle)
    };
}


export function evaluateRightArmScore(angle) {

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