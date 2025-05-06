import React, { useState, useEffect } from "react";
import { AppLayout } from "@/themes";
import MemoryCard from "@/components/memory-card-game/MemoryCard";

const images = [
  "/images/games/card/1.png",
  "/images/games/card/2.png",
  "/images/games/card/3.png",
  "/images/games/card/4.png",
  "/images/games/card/5.png",
  "/images/games/card/6.png",
  "/images/games/card/7.png",
  "/images/games/card/8.png",
  "/images/games/card/9.png",
  "/images/games/card/10.png",
  "/images/games/card/11.png",
  "/images/games/card/12.png",
];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

const MemoryCardGame = () => {
  const [originalCards, setOriginalCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);

  useEffect(() => {
    const selected = shuffleArray([...images]).slice(0, 6); // ✅ สุ่ม 6 ใบ
    const paired = [...selected, ...selected]; // ✅ จับคู่เป็น 12
    const shuffled = shuffleArray(paired); // ✅ สลับ

    setOriginalCards(selected); // เก็บเฉพาะ 6 ใบที่สุ่ม
    setShuffledCards(shuffled); // ใช้เล่นเกม
  }, []);

  return (
    <div
      className="flex flex-col items-center text-center justify-center pb-18"
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: "url('/images/BGgame/Asset15.png')",
        backgroundSize: "cover",
      }}
    >
      <MemoryCard images={originalCards} />
    </div>
  );
};

MemoryCardGame.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default MemoryCardGame;
