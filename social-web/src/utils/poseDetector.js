import {
    FilesetResolver,
    PoseLandmarker,
} from "@mediapipe/tasks-vision";

let poseLandmarker = null;

export async function loadPoseDetector() {
    if (poseLandmarker) {
        return poseLandmarker;
    }

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
        },

        runningMode: "VIDEO",

        numPoses: 1,
    });

    return poseLandmarker;
}