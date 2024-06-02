import React from "react";
import YouTube from "react-youtube";
import ReactPlayer from "react-player/youtube";
export default function FooterContant() {
    return (
        <div className="w-full justify-center items-center">
            <ReactPlayer url="https://www.youtube.com/watch?v=LpW8cTkt7rk" loop={true} width={430} height={250}/>
        </div>
    );

}