import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import moment from "moment";
import "moment/locale/th";
import { useRouter } from "next/router";
import Avatar from "../utils/Avatar";
moment.locale("th");
import UserPanel from "./HallOfFame/UserPanel";
import { Slide, Dialog } from "@mui/material";
import { RiHandCoinLine } from "react-icons/ri";
import { FaSquareWebAwesomeStroke } from "react-icons/fa6";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

const position = [
  { name: "BM", value: "BM" },
  { name: "CLSM", value: "CLSM" },
  { name: "CLSA", value: "CLSA" },
  { name: "CFSA", value: "CFSA" },
  { name: "CISA", value: "CISA" },
  { name: "CFSA_YINDEE ", value: "CFSA_YINDEE" },
  { name: "WCRM", value: "WCRM" },
  { name: "PBCRM", value: "PBCRM" },
  { name: "EWS", value: "EWS" },
  { name: "MDS", value: "MDS" },
  { name: "MAL", value: "MAL" },
  { name: "CISAL", value: "CISAL" },
  { name: "AL_GH", value: "AL GH" },
  { name: "NC_MKT", value: "NC MKT" },
  { name: "UC_MKT", value: "UC MKT" },
];

const thaiMonths = [
  { name: "มกราคม", value: 1 },
  { name: "กุมภาพันธ์", value: 2 },
  { name: "มีนาคม", value: 3 },
  { name: "เมษายน", value: 4 },
  { name: "พฤษภาคม", value: 5 },
  { name: "มิถุนายน", value: 6 },
  { name: "กรกฎาคม", value: 7 },
  { name: "สิงหาคม", value: 8 },
  { name: "กันยายน", value: 9 },
  { name: "ตุลาคม", value: 10 },
  { name: "พฤศจิกายน", value: 11 },
  { name: "ธันวาคม", value: 12 },
];

export default function ClubLeaderboard({ handleTabClick }) {
  const [leaderboard, setLeaderboard] = useState({});
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [activeTab, setActiveTab] = useState("BM");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasPoint, setHasPoint] = useState(false);

  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading{
  }, [status]);

  const { data, error, mutate, isLoading } = useSWR(
    selectedMonth && selectedYear
      ? `/api/club/hall-of-fame/leaderboard?month=${selectedMonth}&year=${selectedYear}`
      : null,
    fetcher,
    {
      onSuccess: (data) => {
        setLoading(false);
        setLeaderboard(data.data);

        const parsed = (data.months || []).map((m) => {
          const [year, month] = m.split("-");
          return { year: +year, month: +month };
        });

        parsed.sort((a, b) =>
          a.year === b.year ? b.month - a.month : b.year - a.year
        );

        setAvailableMonths(parsed);

        if (!selectedMonth || !selectedYear) {
          setSelectedYear(parsed[0]?.year);
          setSelectedMonth(parsed[0]?.month);
        }
      },
    }
  );

  const { data: userData, mutate: mutateUser } = useSWR(
    `/api/users/${userId}`,
    fetcher,
    {
      onSuccess: (data) => {
        setUser(data.user);
      },
    }
  );

  useEffect(() => {
    if (leaderboard && user) {
      const getCurrentUserData = () => {
        for (const rewardKey in leaderboard) {
          const reward = leaderboard[rewardKey];
          for (const pos in reward.positions) {
            const found = reward.positions[pos].find(
              (u) => u.empId === user.empId
            );
            if (found) return found;
          }
        }
        return null;
      };

      setCurrentUser(getCurrentUserData());
    }
  }, [leaderboard, user]);

  useEffect(() => {
    if (currentUser && user) {
      const fetchPoint = async () => {
        const res = await axios.get(
          `/api/club/hall-of-fame/get-points?halloffameId=${currentUser._id}&userId=${user.userId}`
        );
        if (res.data.data.length > 0) {
          setHasPoint(true);
        } else {
          setHasPoint(false);
        }
      };

      fetchPoint();
    }
  }, [currentUser, user]);

  const fetchPoint = async () => {
    const res = await axios.get(
      `/api/club/hall-of-fame/get-points?halloffameId=${currentUser._id}&userId=${user.userId}`
    );
    if (res.data.data.length > 0) {
      setHasPoint(true);
    } else {
      setHasPoint(false);
    }
  };

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  const handleClick = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setOpenModal(false);
  };

  const handleGetPoint = async (id, point) => {
    const data = {
      halloffameId: id,
      points: point,
      userId: user.userId,
    };

    try {
      await axios.post(`/api/club/hall-of-fame/get-points`, data);
      fetchPoint();
      await Swal.fire({
        icon: "success",
        title: "รับคะแนนสําเร็จ",
        text: `คุณได้รับ ${point} คะแนน`,
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
      });
    } catch (error) {
      console.log(error);
      toast.error("รับคะแนนไม่สําเร็จ");
    }
  };

  if (
    !leaderboard ||
    status === "loading" ||
    !session ||
    !userId ||
    isLoading ||
    loading
  )
    return <Loading />;

  return (
    <div className="flex flex-col w-full pb-20 bg-gray-200">
      <div className="flex flex-col items-center justify-center bg-white w-full">
        <h1 className="text-3xl font-bold text-[#0056FF]">Leaderboard</h1>
        {/* selected month & year */}
        {availableMonths.length > 0 && (
          <div className="mt-2 flex gap-2 items-center">
            <span>เดือน</span>
            <select
              value={`${selectedYear}-${selectedMonth}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split("-");
                setSelectedYear(+year);
                setSelectedMonth(+month);
              }}
              className="px-2 py-1 outline-none"
            >
              {availableMonths.map((m, i) => (
                <option key={i} value={`${m.year}-${m.month}`}>
                  {moment(`${m.year}-${m.month}-01`).format("MMMM YYYY")}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-row p-4 bg-white gap-4 overflow-x-auto">
        {position.map((p, i) => (
          <div
            key={i}
            className="cursor-pointer"
            onClick={() => handleActiveTab(p.value)}
          >
            <div
              className={`px-4 py-1 rounded-full ${
                activeTab === p.value
                  ? "bg-[#0056FF] text-white"
                  : "bg-gray-200"
              }`}
            >
              {p.name}
            </div>
          </div>
        ))}
      </div>

      {/* current user */}
      {currentUser && (
        <div className="mt-4 flex flex-col p-4 bg-white">
          <div className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-2 border rounded-full bg-gray-50">
            <div className="flex items-center gap-1">
              <Image
                src={currentUser.user.pictureUrl}
                alt={currentUser.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>

            <div className="flex flex-col ml-4">
              <h2 className="text-sm font-bold">{currentUser.name}</h2>
              <p className="text-sm text-gray-500">{currentUser.rewardtype}</p>
            </div>

            {(currentUser.rewardtype === "Grand Ambassador" ||
              currentUser.rewardtype === "Ambassador") && (
              <div className="flex items-center gap-2">
                {!hasPoint && (
                  <div
                    className="border border-gray-300 rounded-xl bg-gray-200 p-2"
                    onClick={() =>
                      handleGetPoint(currentUser._id, currentUser.points)
                    }
                  >
                    <RiHandCoinLine size={22} />
                  </div>
                )}

                <div
                  className="border border-gray-300 rounded-xl bg-gray-200 p-2"
                  onClick={() =>
                    handleTabClick("hall-of-fame", currentUser.rewardtype)
                  }
                >
                  <FaSquareWebAwesomeStroke size={22} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-6">
        {Object.entries(leaderboard).map(([rewardKey, rewardData]) => {
          const posUsers = rewardData.positions[activeTab] || [];
          if (!posUsers.length) return null;

          return (
            <div
              key={rewardKey}
              className="border rounded-xl p-4 bg-white shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                {rewardData.badge.image && (
                  <Image
                    src={rewardData.badge.image}
                    alt={rewardData.badge.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                )}
                <h2 className="text-xl font-bold">
                  {rewardData.badge.name || rewardKey}
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                {posUsers.map((user, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-2 border rounded-full bg-gray-50"
                    onClick={() => handleClick(user)}
                  >
                    <div className="flex items-center gap-1">
                      {/* <div className="font-bold text-blue-600">{user.rank}</div> */}
                      <Avatar
                        key={user.empId}
                        src={user.user?.pictureUrl}
                        size={40}
                        userId={user.userId}
                      />
                    </div>
                    <div className="flex flex-col ml-4">
                      <span className="font-semibold text-gray-800 text-sm">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.empId}
                      </span>
                    </div>
                    <div className="text-sm font-bold bg-yellow-400 px-2 py-0.5 rounded-full">
                      {user.achieve}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <UserPanel data={selectedUser} onClose={handleCloseModal} />
      </Dialog>
    </div>
  );
}
