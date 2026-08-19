import Webcam from "react-webcam";
import { forwardRef } from "react";

const WebcamView = forwardRef((props, ref) => {

    return (
        <Webcam
            ref={ref}
            audio={false}
            mirrored={true}
            className="webcam"
        />
    );

});

export default WebcamView;