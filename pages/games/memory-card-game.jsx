import React from "react";
import { AppLayout } from "@/themes";
import MemoryCard from "@/components/memory-card-game/MemoryCard";

const MemoryCardGame = () => {

    const images = [
        '/images/memorycardgame/Game2/Asset28game2.png',
        '/images/memorycardgame/Game2/Asset29game2.png',
        '/images/memorycardgame/Game2/Asset30game2.png',
        '/images/memorycardgame/Game2/Asset31game2.png',
        '/images/memorycardgame/Game2/Asset32game2.png',
        '/images/memorycardgame/Game2/Asset33game2.png',
        
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