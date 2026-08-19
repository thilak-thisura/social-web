import { evaluateLeftArm, evaluateLeftArmScore } from "./leftArmRaise";
import { evaluateRightArm, evaluateRightArmScore } from "./rightArmRaise";
import { evaluateLeftKnee, evaluateLeftKneeScore } from "./leftKnee";
import { evaluateRightKnee, evaluateRightKneeScore } from "./rightKnee";

export const exercises = [
    {
        id: "left-arm",
        name: "Raise your Left Arm",

        startAngle: 40,
        targetAngle: 170,
        repThreshold: 100,
        direction: "increase",

        evaluate: evaluateLeftArm,
        evaluateAngle: evaluateLeftArmScore
    },
    {
        id: "right-arm",
        name: "Raise your Right Arm",

        startAngle: 40,
        targetAngle: 170,
        repThreshold: 100,
        direction: "increase",

        evaluate: evaluateRightArm,
        evaluateAngle: evaluateRightArmScore
    },
    {
        id: "left-leg",
        name: "Raise your Left Leg",

        startAngle: 170,
        targetAngle: 70,
        repThreshold: 100,
        direction: "decrease",

        evaluate: evaluateLeftKnee,
        evaluateAngle: evaluateLeftKneeScore
    },
    {
        id: "right-leg",
        name: "Raise your Right Leg",

        startAngle: 170,
        targetAngle: 70,
        repThreshold: 100,
        direction: "decrease",

        evaluate: evaluateRightKnee,
        evaluateAngle: evaluateRightKneeScore
    }
];