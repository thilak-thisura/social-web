import { calculateAngle } from "../utils/calculateAngle";

export function evaluateLeftKnee(landmarks) {

    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    if (
        !leftHip ||
        !leftKnee ||
        !leftAnkle ||
        leftHip.visibility < 0.6 ||
        leftKnee.visibility < 0.6 ||
        leftAnkle.visibility < 0.6
    ) {
        return {
            detected: false,
            angle: null,
            score: "Left Leg not detected",
            color: "#a71100"
        };
    }

    const angle = calculateAngle(
        leftHip,
        leftKnee,
        leftAnkle
    );

    return {
        detected: true,
        angle,
        ...evaluateLeftKneeScore(angle)
    };
}


export function evaluateLeftKneeScore(angle) {

    if (angle <= 60) {
        return {
            score: "Good",
            color: "#2ecc71"
        };
    }

    if (angle <= 100) {
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