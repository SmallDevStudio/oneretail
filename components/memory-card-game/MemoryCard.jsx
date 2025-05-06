import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import styles from "@/styles/memorycardgame.module.css";
import MemoryModal from "../MemoryModal";
import axios from "axios";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import moment from "moment"; // เพิ่ม moment สำหรับการตรวจสอบวันที่
import MemoryNotiModal from "../MemoryNotiModal";
import { useRouter } from "next/router";
import Modal from "../Modal";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const GameBoard = ({ images }) => {
  const { data: session } = useSession();
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState(Infinity);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown timer
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notiModalOpen, setNotiModalOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [alreadyPlayedToday, setAlreadyPlayedToday] = useState(false);
  const [open, setOpen] = useState(false);
  const [isGameSaved, setIsGameSaved] = useState(false); // ตัวแปรสถานะใหม่สำหรับเช็คการบันทึกเกม

  const router = useRouter();
  const userId = session?.user?.id;
  const timerRef = useRef(null);

  const { data, error, isLoading } = useSWR(
    `/api/games/memorygame/${session?.user.id}`,
    fetcher
  );

  useEffect(() => {
    checkIfPlayedToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const shuffledImages = shuffleArray([...images, ...images]);
    setCards(shuffledImages);
  }, [images]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          saveGamePlay(); // เรียกฟังก์ชันนี้เมื่อเวลาหมด
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const checkIfPlayedToday = async () => {
    if (session) {
      const userId = session.user.id;

      try {
        const response = await axios.get(`/api/games/memorygame/${userId}`);
        const gamesToday = response.data.data.filter((game) =>
          moment(game.createdAt).isSame(moment(), "day")
        );

        if (gamesToday.length > 0) {
          setAlreadyPlayedToday(true);
          setNotiModalOpen(true);
        }
      } catch (error) {
        console.error("Error checking game play:", error);
      }
    }
  };

  const saveGamePlay = async (isComplete = false) => {
    if (session && !isGameSaved) {
      // ตรวจสอบว่าเกมยังไม่ถูกบันทึก
      setIsGameSaved(true); // ตั้งค่าสถานะว่าบันทึกเกมแล้ว

      if (!isComplete) {
        try {
          await axios.post("/api/games/memorygame", {
            userId,
            moves,
            score,
            timeLeft,
            complete: false, // ไม่สำเร็จ
          });
          setOpen(true); // เปิด Modal เมื่อไม่สามารถจับคู่ได้ครบ
        } catch (error) {
          console.error("Error saving game play:", error);
        }
      } else {
        try {
          const response = await axios.post("/api/games/memorygame", {
            userId,
            moves,
            score,
            timeLeft,
            complete: true, // เล่นสำเร็จ
          });
          await axios.post("/api/points/point", {
            userId,
            points: 1,
            contentId: response.data.data._id,
            path: "games",
            subpath: "memory game",
            type: "earn",
            description: "memorygame",
          });
          setIsModalOpen(true); // เปิด Modal แจ้งเตือนเมื่อเล่นสำเร็จ
        } catch (error) {
          console.error("Error saving game play:", error);
        }
      }
    }
  };

  const handleCardClick = (index) => {
    if (alreadyPlayedToday) return;

    if (flippedIndices.length === 1) {
      const firstIndex = flippedIndices[0];
      if (cards[firstIndex] === cards[index]) {
        setMatchedIndices([...matchedIndices, firstIndex, index]);
        setScore(score + 1);
        if (matchedIndices.length + 2 === cards.length) {
          // จับคู่ครบ 6 คู่
          clearInterval(timerRef.current);
          saveGamePlay(true); // บันทึกเกมพร้อม complete: true
        }
      }
      setFlippedIndices([...flippedIndices, index]);
      setMoves(moves + 1);
    } else {
      setFlippedIndices([index]);
    }
  };

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setTimeout(() => setFlippedIndices([]), 1000);
    }
  }, [flippedIndices]);

  const closeModal = () => {
    setIsModalOpen(false);
    window.location.href = "/games";
  };

  const closeNotiModal = () => {
    setNotiModalOpen(false);
    router.push("/games");
  };

  const handleClose = () => {
    setOpen(false);
    router.push("/games");
  };

  return (
    <div className="p-4 mb-20 bg-white shadow-lg rounded-xl m-4 w-full">
      <h1 className="text-2xl font-bold text-[#0056FF]">เกมจับคู่</h1>
      <p className="text-gray-400 text-sm mb-2">
        เลือกไพ่สองใบที่มีเนื้อหาเดียวกัน
      </p>
      <div>
        <div className="text-gray-400 text-sm mb-2 flex justify-evenly">
          <span className="font-bold">MOVES: {moves} </span>
        </div>
        <p className="text-[#F68B1F] text-[3rem] mb-2 font-bold">{timeLeft}</p>
      </div>
      <div className="relative w-full">
        <div className={styles.board}>
          {cards.map((image, index) => (
            <Card
              key={index}
              image={image}
              onClick={() => handleCardClick(index)}
              isFlipped={flippedIndices.includes(index)}
              isMatched={matchedIndices.includes(index)}
            />
          ))}
        </div>
      </div>

      <MemoryModal isOpen={isModalOpen} onRequestClose={closeModal} score={1} />
      <MemoryNotiModal
        isOpen={notiModalOpen}
        onRequestClose={closeNotiModal}
        message="วันนี้คุณได้คะแนนแล้ว ลองพรุ่งนี้ใหม่นะจ๊ะ"
      />

      {open && (
        <Modal open={open} onClose={handleClose}>
          <div className="flex flex-col items-center mt-5">
            <h2 className="text-3xl font-bold mb-4 text-[#0056FF]">
              เกมเสร็จสิ้น
            </h2>
            <p className="text-lg mb-2">คุณเลือกไม่ครบ 6 คู่</p>
            <div className="flex justify-center mt-4">
              <button
                className="bg-[#0056FF] text-white py-2 px-4 rounded"
                onClick={handleClose}
              >
                ลองใหม่
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GameBoard;
