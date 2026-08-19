export function createSessionStats() {

    return {
        totalReps: 0,
        good: 0,
        medium: 0,
        low: 0,
        angles: []
    };

}


export function addRep(
    stats,
    angle,
    score
) {

    stats.totalReps++;

    stats.angles.push(angle);


    if (score === "Good") {

        stats.good++;

    }
    else if (score === "Medium") {

        stats.medium++;

    }
    else if (score === "Low") {

        stats.low++;

    }

}


export function getSessionSummary(
    stats,
    direction
) {

    if (stats.totalReps === 0) {

        return {
            totalReps: 0,
            good: 0,
            medium: 0,
            low: 0,
            bestStretch: 0,
            overallScore: "--"
        };

    }


    let bestStretch;


    if (direction === "increase") {

        bestStretch =
            Math.max(...stats.angles);

    }
    else {

        bestStretch =
            Math.min(...stats.angles);

    }


    const scorePoints =
        (
            stats.good * 3 +
            stats.medium * 2 +
            stats.low
        ) / stats.totalReps;


    let overallScore;


    if (scorePoints >= 2.5) {

        overallScore = "Good";

    }
    else if (scorePoints >= 1.5) {

        overallScore = "Medium";

    }
    else {

        overallScore = "Low";

    }


    return {

        totalReps: stats.totalReps,

        good: stats.good,

        medium: stats.medium,

        low: stats.low,

        bestStretch,

        overallScore

    };

}