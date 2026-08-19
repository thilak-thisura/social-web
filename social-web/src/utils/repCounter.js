export function createRepCounter(
    startAngle,
    repThreshold,
    direction
) {

    let movementStarted = false;

    let targetReached = false;

    let repCount = 0;

    let maxAngle = 0;

    let minAngle = 180;


    function update(angle) {

        if (direction === "increase") {

            if (!movementStarted) {

                if (angle <= startAngle) {

                    movementStarted = true;

                    targetReached = false;

                    maxAngle = angle;

                }

                return {
                    completed: false,
                    repCount,
                    angle: null
                };

            }


            if (angle > maxAngle) {

                maxAngle = angle;

            }


            if (maxAngle > repThreshold) {

                targetReached = true;

            }


            if (
                targetReached &&
                angle <= startAngle
            ) {

                repCount++;

                const completedAngle =
                    maxAngle;


                movementStarted = false;

                targetReached = false;

                maxAngle = 0;


                return {
                    completed: true,
                    repCount,
                    angle: completedAngle
                };

            }

        }


        if (direction === "decrease") {

            if (!movementStarted) {

                if (angle >= startAngle) {

                    movementStarted = true;

                    targetReached = false;

                    minAngle = angle;

                }

                return {
                    completed: false,
                    repCount,
                    angle: null
                };

            }


            if (angle < minAngle) {

                minAngle = angle;

            }


            if (minAngle < repThreshold) {

                targetReached = true;

            }


            if (
                targetReached &&
                angle >= startAngle
            ) {

                repCount++;

                const completedAngle =
                    minAngle;


                movementStarted = false;

                targetReached = false;

                minAngle = 180;


                return {
                    completed: true,
                    repCount,
                    angle: completedAngle
                };

            }

        }


        return {
            completed: false,
            repCount,
            angle: null
        };

    }


    function reset() {

        movementStarted = false;

        targetReached = false;

        repCount = 0;

        maxAngle = 0;

        minAngle = 180;

    }


    return {
        update,
        reset
    };

}