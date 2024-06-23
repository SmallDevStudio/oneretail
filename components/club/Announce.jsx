import React from "react";
import Image from "next/image";

const Announce = () => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Image
            src="/images/club/club.png"
            alt="Leaderboard"
            width={500}
            height={500}
            style={{
                objectFit: "cover",
                objectPosition: "center",
                height: "auto",
                width: "auto",
            }}
        />
        </div>
    );
};

export default Announce;