import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Modal from "../Modal";
import Loading from "../Loading";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { Divider } from "@mui/material";

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
  const [loading, setLoading] = useState(false);
  const [hasTodayPlayed, setHasTodayPlayed] = useState(false);

  const choices = ["rock", "paper", "scissors"];
  const imageChoices = {
    rock: "/images/game3/rock.png",
    paper: "/images/game3/paper.png",
    scissors: "/images/game3/scissors.png",
  }

  useEffect(() => {
    const fetchHasPlayedToday = async () => {
      try {
        const response = await axios.get("/api/games/rock-paper-scissors", {
          params: { userId },
        });
        setHasPlayedToday(response.data.hasPlayedToday);
      } catch (error) {
        console.error("Error fetching hasPlayedToday:", error);
      }
    };
    fetchHasPlayedToday();
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

  };

  useEffect(() => {
    // เช็คว่าชนะ 2 ใน 3 หรือยัง
    if (userScore === 3 || cpuScore === 3) {
      setTimeout(() => setShowModal(true), 1000);
    }
  }, [userScore, cpuScore]);

  const handleModalClose = async () => {
    const win = userScore > cpuScore ? true : false;
    try {
      // บันทึกข้อมูลการชนะ
      const res = await axios.post("/api/games/rock-paper-scissors", {
        userId,
        score: userScore,
        cpu: cpuScore,
        isWin: win,
        round: round,
      });

      if (res.data.success && !hasPlayedToday && win) {
        await axios.post("/api/points/point", {
          userId,
          description: "Rock Paper Scissors Game",
          type: "earn",
          contentId: res.data.data._id,
          path: "games",
          subpath: "rock-paper-scissors",
          points: 5,
        });
      }
    } catch (error) {
      console.error("Error saving game data:", error);
    }

    setShowModal(false);
    setUserChoice(null);
    setCpuChoice(null);
    setResult("");
    setTimer(10);
    setRound(1);
    router.push("/games");
  };

  const handleChoiceClick = (choice) => {
    if (timer > 0) {
      playRound(choice);
    }
  };

  const handleNextRound = () => {
    setUserChoice(null);
    setCpuChoice(null);
    setResult("");
    setTimer(10);
    setRound(round + 1);
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col p-4 bg-[#0056FF] min-h-screen pb-32">
      
        <div className="flex flex-row items-center justify-between gap-4 mb-4 mt-2">
          <div className="flex items-center">
            <IoIosArrowBack
              size={30}
              className="text-white"
              onClick={() => router.back()}
            />
          </div>
          <span className="flex text-3xl font-bold text-white">เป่ายิ้งฉุบ</span>
          <span></span>
        </div>

        <div className="flex flex-col mb-2 px-2">
          <span className="text-sm text-gray-200">
            เกมเป่ายิ้งฉุบ ให้คุณเลือก ค้อน กรรไกร กระดาษ เพื่อเอาชนะคู่แข่ง 
            ถ้าใครได้ 3 คะแนนก่อน จะเป็นผู้ชนะเกม
          </span>
        </div>

      <div className="flex flex-col justify-between bg-white rounded-2xl min-h-[75vh] p-4 ">
        <div className="flex flex-col">
          <div className="flex flex-row justify-evenly text-sm bg-gray-300 rounded-2xl">
            <div className="flex flex-col items-center px-4 py-2">
              <span className="text-md font-bold">คะแนน</span>
              <span className="text-3xl font-bold text-red-600">{userScore}</span>
            </div>

            <Divider orientation="vertical" flexItem />

            <div className="flex flex-col items-center px-4 py-2">
              <span className="text-md font-bold">คู่แข่ง</span>
              <span className="text-3xl font-bold text-red-600">{cpuScore}</span>
            </div>

            <Divider orientation="vertical" flexItem />

            <div className="flex flex-col items-center px-4 py-2">
              <span className="text-md font-bold">เวลา</span>
              <span className="text-3xl font-bold">{timer}</span>
            </div>

            <Divider orientation="vertical" flexItem />

            <div className="flex flex-col items-center px-4 py-2">
              <span className="text-md font-bold">รอบที่</span>
              <span className="text-3xl font-bold text-[#F2871F]">{round}</span>
            </div>
          </div>
        </div>
      
      <div className="flex flex-col mt-2">
        {userChoice && cpuChoice && (
          <div className="flex flex-row gap-4 items-center justify-evenly bg-gray-300 p-4 rounded-2xl min-h-[80%]">
            <div className="flex flex-col items-center gap-2">
              <Image
                src={imageChoices[userChoice]}
                alt={userChoice}
                width={100}
                height={100}
              />
              <span className="font-bold bg-[#F2871F] px-4 py-1 rounded-full text-white">คุณเลือก</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Image
                src={imageChoices[cpuChoice]}
                alt={cpuChoice}
                width={100}
                height={100}
              />
              <span className="font-bold bg-[#0056FF] px-4 py-1 rounded-full text-white">คู่ต่อสู้เลือก</span>
            </div>
          
          </div>
        )}

        {result && (
          <div className="flex flex-col items-center mt-2">
            <span 
              className={`text-3xl font-bold ${result === "คุณชนะรอบนี้!" ? "text-green-500" : result === "คุณแพ้รอบนี้!" ? "text-red-500" : "text-blue-600"}`}>
                {result}
            </span>
            <button
              className="bg-[#F2871F] text-white px-4 py-2 rounded-full mt-4"
              onClick={handleNextRound}
            >
              รอบถัดไป
            </button>
          </div>
        )}
        </div>

        <div className="flex flex-row justify-center mt-4 gap-4 w-full bg-gray-200 p-4 rounded-2xl">
          {choices.map((choice) => (
            <div
              key={choice}
            >
              <Image
                src={imageChoices[choice]}
                alt={choice}
                width={100}
                height={100}
                className="cursor-pointer"
                onClick={() => handleChoiceClick(choice)}
              />
            </div>
          ))}
        </div>
        {showModal && (
          <Modal 
            isOpen={showModal} 
            onClose={handleModalClose}
          >
            <div className="flex flex-col justify-center items-center">
              
              <span className={`text-2xl font-bold mb-4 ${userScore === 3 ? "text-green-500" : "text-red-500"}`}>
                {userScore === 3 ? "คุณชนะเกม!" : "คุณแพ้เกม!"}
              </span>
              {!hasTodayPlayed && userScore === 3 && (
                <span className="text-3xl font-bold mb-4">
                  คุณได้รับ 5 Point
                </span>
              )}
              {hasTodayPlayed && (
                <span className="text-2xl font-bold mb-4">
                  วันนี้คุณได้เล่นเกมแล้ว
                </span>
              )}
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
    </div>
  );
};

export default RockPaperScissors;
