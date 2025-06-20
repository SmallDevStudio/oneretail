import React, { useState, useEffect, useCallback, useMemo } from "react";
import LeaderBoard from "@/components/club/Leaderboard";
import HallOfFamePage from "@/components/club/HallOfFame/HallOfFamePage";
import Image from "next/image";
import { useRouter } from "next/router";
import { Slide, Dialog } from "@mui/material";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { useSession } from "next-auth/react";
import NewRules from "@/components/club/NewRules";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Test() {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [type, setType] = useState("Grand%20Ambassador");
  const [openWelcome, setOpenWelcome] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const router = useRouter();
  const { subtab } = router.query;

  const { data: session, status } = useSession();

  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "loading" || !session) return;
  }, [status, session]);

  useEffect(() => {
    const tab = router.query.tab || "leaderboard";
    setActiveTab(tab);
  }, [router.query.tab]);

  useEffect(() => {
    const fetchRead = async () => {
      try {
        const response = await axios.get(
          `/api/club/read-welcome?userId=${userId}`
        );
        if (response.data.data.length > 0) {
          setHasRead(true);
          setOpenWelcome(false);
        } else {
          setOpenWelcome(true);
        }
      } catch (error) {
        console.error("Error fetching read status:", error);
      }
    };

    if (userId) {
      fetchRead();
    }
  }, [userId]);

  const handleTabClick = useCallback((tab) => {
    if (tab !== "hall-of-fame") {
      window.history.pushState(null, "", `?tab=${tab}`);
    } else {
      window.history.pushState(
        null,
        "",
        `?tab=${tab}&subtab=${encodeURIComponent("Grand Ambassador")}`
      );
    }
    setActiveTab(tab);
  }, []);

  const handleClick = (tab, rewardtype) => {
    const capitalized = rewardtype
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    const allowed = ["Grand Ambassador", "Ambassador"];
    if (!allowed.includes(capitalized)) return;

    const encode = encodeURIComponent(capitalized);
    setType(capitalized);
    setActiveTab(tab);
    window.history.pushState(null, "", `?tab=${tab}&subtab=${encode}`);
  };

  const decodedType = useMemo(() => {
    if (!subtab) return "Grand Ambassador"; // default
    return decodeURIComponent(subtab)
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }, [subtab]);

  const handleClose = async () => {
    await axios.post("/api/club/read-welcome", { userId: userId });
    setOpenWelcome(false);
  };

  return (
    <div>
      <div className="flex items-center justify-center bg-white p-4">
        <Image
          src="/images/club/club-logo.png"
          alt="club logo"
          width={250}
          height={250}
          className="object-contain"
        />
      </div>

      {/* Tabs */}
      <div>
        <ul className="flex flex-row items-center justify-center flex-wrap gap-6">
          <li
            className={`inline-block px-2 border-b-2 rounded-t-lg font-bold ${
              activeTab === "hall-of-fame"
                ? "text-[#0056FF] border-[#F2871F]"
                : "border-transparent hover:text-[#0056FF] hover:border-[#F2871F]"
            }`}
            onClick={() => handleTabClick("hall-of-fame")}
          >
            Hall of Fame
          </li>
          <li
            className={`inline-block px-2 border-b-2 rounded-t-lg font-bold ${
              activeTab === "leaderboard"
                ? "text-[#0056FF] border-[#F2871F]"
                : "border-transparent hover:text-[#0056FF] hover:border-[#F2871F]"
            }`}
            onClick={() => handleTabClick("leaderboard")}
          >
            Leaderboard
          </li>
          <li
            className={`inline-block px-2 border-b-2 rounded-t-lg font-bold ${
              activeTab === "rules"
                ? "text-[#0056FF] border-[#F2871F]"
                : "border-transparent hover:text-[#0056FF] hover:border-[#F2871F]"
            }`}
            onClick={() => handleTabClick("rules")}
          >
            กติกา
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === "hall-of-fame" && (
          <HallOfFamePage typeData={decodedType} />
        )}
        {activeTab === "leaderboard" && (
          <LeaderBoard handleTabClick={handleClick} />
        )}
        {activeTab === "rules" && <NewRules />}
      </div>

      <Dialog
        open={openWelcome}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            background: "transparent",
            boxShadow: "none",
            overflow: "hidden",
            width: "100vw",
            height: "auto",
          },
        }}
      >
        <div className="flex flex-col">
          <div className="relative">
            <Image
              src="/images/hall-of-fame/welcome-ORC.jpg"
              alt="coming-soon"
              width={500}
              height={500}
              className="object-contain"
            />
            <div className="absolute top-2 right-2 bg-white transition-all rounded-full p-1">
              <IoClose size={20} onClick={handleClose} />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
