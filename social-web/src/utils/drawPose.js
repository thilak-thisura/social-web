const CONNECTIONS = [

    // Left Arm
    [11, 13],
    [13, 15],

    // Right Arm
    [12, 14],
    [14, 16],

    // Shoulders
    [11, 12],

    // Torso
    [11, 23],
    [12, 24],
    [23, 24],

    // Left Leg
    [23, 25],
    [25, 27],

    // Right Leg
    [24, 26],
    [26, 28]

];

export function drawLandmarks(canvas, landmarks) {

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "red";

    const HIDDEN_HAND_POINTS = [17, 18, 19, 20, 21, 22];

    landmarks.forEach((point, index) => {

        if (HIDDEN_HAND_POINTS.includes(index)) {
            return;
        }


        ctx.beginPath();

        ctx.arc(
            point.x * canvas.width,
            point.y * canvas.height,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });

}

export function drawSkeleton(canvas, landmarks) {

    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = "#00ff00";

    ctx.lineWidth = 4;

    CONNECTIONS.forEach(([start, end]) => {

        const p1 = landmarks[start];
        const p2 = landmarks[end];

        ctx.beginPath();

        ctx.moveTo(
            p1.x * canvas.width,
            p1.y * canvas.height
        );

        ctx.lineTo(
            p2.x * canvas.width,
            p2.y * canvas.height
        );

        ctx.stroke();

    });

}