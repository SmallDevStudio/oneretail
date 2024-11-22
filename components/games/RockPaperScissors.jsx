import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Modal from "./Modal";
import Loading from "./Loading";

const RockPaperScissors = ({ userId }) => {
  const router = useRouter();
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(10);
  const [userChoice, setUserChoice] = useState(null);
  const [cpuChoice, setCpuChoice] = useState(null);
  const [result, setResult] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const choices = ["rock", "paper", "scissors"];

  useEffect(() => {
    const checkIfPlayedToday = async () => {
      try {
        const response = await axios.get("/api/games/rock-paper-scissors", {
          params: { userId },
        });
  
        setHasPlayedToday(response.data.hasPlayedToday || false);
  
        if (response.data.hasPlayedToday) {
          setShowModal(true);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking play status:", error);
      }
    };
  
    checkIfPlayedToday();
  }, [userId]);

  useEffect(() => {
    // จับเวลาในแต่ละรอบ
    if (timer > 0 && !userChoice) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }

    if (timer === 0 && !userChoice) {
      handleAutoPick();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, userChoice]);

  const handleAutoPick = () => {
    const randomChoice = choices[Math.floor(Math.random() * 3)];
    playRound(randomChoice);
  };

  const playRound = (userPick) => {
    const cpuPick = choices[Math.floor(Math.random() * 3)];
    setUserChoice(userPick);
    setCpuChoice(cpuPick);

    if (
      (userPick === "rock" && cpuPick === "scissors") ||
      (userPick === "scissors" && cpuPick === "paper") ||
      (userPick === "paper" && cpuPick === "rock")
    ) {
      setUserScore(userScore + 1);
      setResult("คุณชนะรอบนี้!");
    } else if (userPick === cpuPick) {
      setResult("เสมอ!");
    } else {
      setCpuScore(cpuScore + 1);
      setResult("คุณแพ้รอบนี้!");
    }

    setTimer(10);
    setRound(round + 1);
  };

  useEffect(() => {
    // เช็คว่าชนะ 2 ใน 3 หรือยัง
    if (userScore === 2 || cpuScore === 2) {
      setTimeout(() => setShowModal(true), 2000);
    }
  }, [userScore, cpuScore]);

  const handleModalClose = async () => {
    try {
      if (userScore === 2) {
        // บันทึกข้อมูลการชนะ
        await axios.post("/api/games/rock-paper-scissors", {
          userId,
          score: 5,
          isWin: true,
        });
  
        if (!hasPlayedToday) {
          // ให้ Point
          await axios.post("/api/points/point", {
            userId,
            description: "Rock Paper Scissors Game",
            type: "earn",
            contentId: null,
            path: "game",
            subpath: "rock-paper-scissors",
            points: 5,
          });
        }
      } else {
        // บันทึกข้อมูลการแพ้
        await axios.post("/api/games/rock-paper-scissors", {
          userId,
          score: 0,
          isWin: false,
        });
      }
    } catch (error) {
      console.error("Error saving game play or giving points:", error);
    }
  
    router.push("/games");
  };

  const handleChoiceClick = (choice) => {
    if (timer > 0) {
      playRound(choice);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-500">เป่ายิ้งฉุบ</h1>
      <p className="text-lg mb-2">รอบที่: {round}/3</p>
      <p className="text-lg mb-2">เวลา: {timer} วินาที</p>
      <div className="flex gap-4">
        {choices.map((choice) => (
          <button
            key={choice}
            className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded"
            onClick={() => handleChoiceClick(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      {userChoice && cpuChoice && (
        <div className="mt-4">
          <p>คุณเลือก: {userChoice}</p>
          <p>คอมพิวเตอร์เลือก: {cpuChoice}</p>
          <p className="font-bold">{result}</p>
        </div>
      )}
      <div className="mt-4">
        <p>คะแนนของคุณ: {userScore}</p>
        <p>คะแนนของคอมพิวเตอร์: {cpuScore}</p>
      </div>
      {showModal && (
        <Modal isOpen={showModal} onClose={handleModalClose}>
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4">
              {userScore === 2 ? "คุณชนะเกม!" : "คุณแพ้เกม!"}
            </h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleModalClose}
            >
              ตกลง
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RockPaperScissors;
