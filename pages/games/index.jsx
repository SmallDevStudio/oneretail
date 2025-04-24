import React, { useState, useEffect } from "react";
import { AppLayout } from "@/themes";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";

const gameData = [
  {
    id: 1,
    title: "ตอบคำถามรับพอยท์ประจำวัน",
    image: "/images/games/3.png",
    link: "/games/quiz",
  },
  {
    id: 2,
    title: "จับคู่รับพอยท์",
    image: "/images/games/2.png",
    link: "/games/memory-card-game",
  },
  {
    id: 3,
    title: "เป่ายิ้งฉุบรับพอยท์",
    image: "/images/games/1.png",
    link: "/games/rock-paper-scissors",
  },
];

export default function Games() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="relative pb-20">
        <div className="flex flex-col items-center text-center justify-center p-4">
          <div className="relative p-3 ">
            <div className="flex items-center text-center justify-center p-2">
              <span className="text-[35px] font-black text-[#0056FF] dark:text-white">
                Games Center
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center text-center justify-center gap-4">
            {gameData.map((game) => (
              <div key={game.id} className="relative">
                <Link href={game.link}>
                  <div className="relative w-full">
                    <Image
                      src={game.image}
                      width={400}
                      height={400}
                      alt={game.title}
                      className="rounded-3xl"
                    />
                    <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[25px] font-black text-white w-full">
                      {game.title}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {open && (
          <Modal open={open} onClose={handleClose}>
            <div className="flex flex-col items-center text-center justify-center p-2 px-1 pz-1">
              <span className="text-[35px] font-black text-[#0056FF] dark:text-white">
                ขออภัย
              </span>
              <span className="text-[25px] font-black text-black dark:text-white">
                เกมส์นี้อยู่ในระหว่างปรับปรุง
              </span>
              <div className="flex items-center text-center justify-center mt-5">
                <button
                  className="flex items-center text-center justify-center px-4 pz-2 bg-[#F2871F] rounded-3xl"
                  onClick={handleClose}
                >
                  <span className="text-md font-black text-white">ตกลง</span>
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
