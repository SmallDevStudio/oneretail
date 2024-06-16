import React from "react";
import { AppLayout } from "@/themes";
import MemoryCard from "@/components/memory-card-game/MemoryCard";

const MemoryCardGame = () => {

    const images = [
        '/images/memorycardgame/1.png',
        '/images/memorycardgame/2.png',
        '/images/memorycardgame/3.png',
        '/images/memorycardgame/4.png',
        '/images/memorycardgame/5.png',
        '/images/memorycardgame/6.png',
    ];

    return (
        <div className="flex flex-col items-center text-center justify-center mb-18" style={{
            width: "100%",
            height: "100vh",
            backgroundImage: "url('/images/BGgame/Asset15.png')",
            backgroundSize: "cover",
        }}>
            <MemoryCard images={images}/>
        </div>
    );

};

MemoryCardGame.getLayout = function getLayout(page) {
    return <AppLayout>{page}</AppLayout>;
};

export default MemoryCardGame;