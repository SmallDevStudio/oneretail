import React from "react";
import YouTube from "react-youtube";
export default function FooterContant() {
    const opts = {
        height: "250px",
        width: "100%",
        playerVars: {
            autoplay: 1,
            loop: 1,
            autohide: 1,
            modestbranding: 1,
            controls: 0,
            showinfo: 0,
        },
    };
    return (
        <div className="w-full justify-center items-center mt-5">
            <YouTube videoId="LpW8cTkt7rk" opts={opts} />
        </div>
    );

}