import React from "react";
import Image from "next/image";

const LeaderBoard = () => {
    return <div>
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
    </div>;
};

export default LeaderBoard;