import React from "react";
import ReactPlayer from "react-player";

export default function FooterContant() {
    return (
        <div className="relative w-full h-[250px] footer-content">
            <ReactPlayer
                url="https://www.youtube.com/watch?v=LpW8cTkt7rk"
                loop={true}
                playing={true}
                controls={false}
                width="100%"
                height="100%"
                config={{
                    youtube: {
                        playerVars: { showinfo: 0 }
                    }
                }}
                className="absolute top-0 left-0 w-full h-full"
            />
        </div>
    );
}
