import { forwardRef } from "react";

const PoseCanvas = forwardRef((props, ref) => {

    return (

        <canvas
            ref={ref}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                transform: "scaleX(-1)",
            }}
        />

    );

});

export default PoseCanvas;