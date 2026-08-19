import { calculateAngle } from "../utils/calculateAngle";

export function evaluateRightKnee(landmarks) {

    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];

    if (
        !rightHip ||
        !rightKnee ||
        !rightAnkle ||
        rightHip.visibility < 0.6 ||
        rightKnee.visibility < 0.6 ||
        rightAnkle.visibility < 0.6
    ) {
        return {
            detected: false,
            angle: null,
            score: "Right Leg not detected",
            color: "#a71100"
        };
    }

    const angle = calculateAngle(
        rightHip,
        rightKnee,
        rightAnkle
    );

    return {
        detected: true,
        angle,
        ...evaluateRightKneeScore(angle)
    };
}


export function evaluateRightKneeScore(angle) {

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