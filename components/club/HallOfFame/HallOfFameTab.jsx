import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { Slide, Dialog } from "@mui/material";
import UserPanel from "./UserPanel";
import Avatar from "@/components/utils/Avatar";
import { Divider } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const badgeData = {
  grand_ambassador: {
    BBD: "/images/hall-of-fame/grand_ambassador/BBD.png",
    AL: "/images/hall-of-fame/grand_ambassador/AL.png",
    BM: "/images/hall-of-fame/grand_ambassador/BM.png",
    CLSM: "/images/hall-of-fame/grand_ambassador/CLSM.png",
    CLSM: "/images/hall-of-fame/grand_ambassador/CLSM.png",
    CLSA: "/images/hall-of-fame/grand_ambassador/CLSA.png",
    CISA_LINE: "/images/hall-of-fame/grand_ambassador/CISA_LINE.png",
    CISA: "/images/hall-of-fame/grand_ambassador/CISA.png",
    CFSA: "/images/hall-of-fame/grand_ambassador/CFSA.png",
    CFSA_YINDEE: "/images/hall-of-fame/grand_ambassador/CFSA_YINDEE.png",
    WCRM: "/images/hall-of-fame/grand_ambassador/WCRM.png",
    PBCRM: "/images/hall-of-fame/grand_ambassador/PBCRM.png",
    EWS: "/images/hall-of-fame/grand_ambassador/EWS.png",
    MDS: "/images/hall-of-fame/grand_ambassador/MDS.png",
    MAL: "/images/hall-of-fame/grand_ambassador/MAL.png",
    CISAL: "/images/hall-of-fame/grand_ambassador/CISAL.png",
    ALGH: "/images/hall-of-fame/grand_ambassador/ALGH.png",
    NCMKT: "/images/hall-of-fame/grand_ambassador/NCMKT.png",
    UCMKT: "/images/hall-of-fame/grand_ambassador/UCMKT.png",
    INVS: "/images/hall-of-fame/grand_ambassador/INVS.png",
  },
  ambassador: {
    BBD: "/images/hall-of-fame/ambassador/BBD.png",
    AL: "/images/hall-of-fame/ambassador/AL.png",
    BM: "/images/hall-of-fame/ambassador/BM.png",
    CLSM: "/images/hall-of-fame/ambassador/CLSM.png",
    CLSM: "/images/hall-of-fame/ambassador/CLSM.png",
    CLSA: "/images/hall-of-fame/ambassador/CLSA.png",
    CISA_LINE: "/images/hall-of-fame/grand_ambassador/CISA_LINE.png",
    CISA: "/images/hall-of-fame/ambassador/CISA.png",
    CFSA: "/images/hall-of-fame/ambassador/CFSA.png",
    CFSA_YINDEE: "/images/hall-of-fame/ambassador/CFSA_YINDEE.png",
    WCRM: "/images/hall-of-fame/ambassador/WCRM.png",
    PBCRM: "/images/hall-of-fame/ambassador/PBCRM.png",
    EWS: "/images/hall-of-fame/ambassador/EWS.png",
    MDS: "/images/hall-of-fame/ambassador/MDS.png",
    MAL: "/images/hall-of-fame/ambassador/MAL.png",
    CISAL: "/images/hall-of-fame/ambassador/CISAL.png",
    ALGH: "/images/hall-of-fame/ambassador/ALGH.png",
    NCMKT: "/images/hall-of-fame/ambassador/NCMKT.png",
    UCMKT: "/images/hall-of-fame/ambassador/UCMKT.png",
    INVS: "/images/hall-of-fame/ambassador/INVS.png",
  },
};

const components = {
  grand_ambassador: {
    header: "/images/hall-of-fame/grand_ambassador/header.png",
    rank: "/images/hall-of-fame/grand_ambassador/rank.png",
    avatar: "/images/hall-of-fame/grand_ambassador/badge.png",
    tag: "/images/hall-of-fame/grand_ambassador/tag.png",
  },
  ambassador: {
    header: "/images/hall-of-fame/ambassador/header.png",
    rank: "/images/hall-of-fame/ambassador/rank.png",
    avatar: "/images/hall-of-fame/ambassador/badge.png",
    tag: "/images/hall-of-fame/ambassador/tag.png",
  },
};

export default function HallOfFameTab({ typeData }) {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(2);
  const [year, setYear] = useState(2025);
  const [monthOptions, setMonthOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [type, setType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!typeData) return;
    if (typeData) setType(typeData);
  }, [typeData]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `/api/club/hall-of-fame?type=${type}&month=${month}&year=${year}`
      );
      setData(res.data.data);
    };
    if (month && year && type) fetchData();
  }, [month, year, type]);

  useEffect(() => {
    const fetchMeta = async () => {
      const res = await axios.get("/api/club/hall-of-fame/meta");
      const monthMap = {
        1: "มกราคม",
        2: "กุมภาพันธ์",
        3: "มีนาคม",
        4: "เมษายน",
        5: "พฤษภาคม",
        6: "มิถุนายน",
        7: "กรกฎาคม",
        8: "สิงหาคม",
        9: "กันยายน",
        10: "ตุลาคม",
        11: "พฤศจิกายน",
        12: "ธันวาคม",
      };
      setMonthOptions(
        res.data.months.map((m) => ({
          value: m,
          label: monthMap[m] || m,
        }))
      );
      setYearOptions(
        res.data.years.map((y) => ({
          value: y,
          label: y + 543,
        }))
      );

      // set default latest values
      if (res.data.months.length > 0)
        setMonth(res.data.months[res.data.months.length - 1]);
      if (res.data.years.length > 0) setYear(res.data.years[0]);
    };

    fetchMeta();
  }, []);

  const isGrand = decodeURIComponent(type || "") === "Grand Ambassador";

  const normalizePosition = (key) => {
    return key.replace(/\s/g, "").toUpperCase(); // เช่น "AL GH" → "ALGH"
  };

  const badgePath = (position) => {
    const decode = decodeURIComponent(type || "");
    const key = decode.toLowerCase().replace(/\s/g, "_"); // "Grand Ambassador" → "grand_ambassador"
    const badge = badgeData[key];
    const normalized = normalizePosition(position);
    return badge?.[normalized] || "";
  };

  const componentPath = (path) => {
    const decode = decodeURIComponent(type || "");
    const key = decode.toLowerCase().replace(/\s/g, "_"); // "Grand Ambassador" → "grand_ambassador"
    const component = components[key];
    return component?.[path] || "";
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedUser(null);
    setOpen(false);
  };

  return (
    <div
      className={`${
        isGrand ? "bg-[#373332] text-white" : "bg-[#EAEAEA] text-black"
      } min-h-screen pb-20 pt-8`}
    >
      {/* Content */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center justify-center">
          <Image
            src={componentPath("header")}
            alt="header-badge"
            width={150}
            height={150}
            className="object-contain"
          />

          <div className="flex flex-row items-center gap-2 mt-4 text-lg">
            <h3 className="font-bold">ประจำเดือน</h3>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className={`${
                isGrand ? "bg-[#373332] text-white" : "bg-[#EAEAEA] text-black"
              }`}
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className={`${
                isGrand ? "bg-[#373332] text-white" : "bg-[#EAEAEA] text-black"
              }`}
            >
              {yearOptions.map((y) => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Data */}
      <div className="flex flex-col gap-4 mt-4">
        {Object.entries(data).map(([groupLabel, positions]) => (
          <div key={groupLabel}>
            <div className="flex justify-center mt-4 mb-4">
              <Image
                src={badgePath(groupLabel)} // จะได้ BBD.png หรือ AL.png
                alt={groupLabel}
                width={140}
                height={140}
                className="object-contain"
              />
            </div>

            {Object.entries(positions).map(([positionKey, positionData]) => {
              const image = badgePath(positionKey);
              return (
                <div key={positionKey}>
                  {image && (
                    <div className="flex justify-center mt-2">
                      <Image
                        src={image}
                        alt={positionKey}
                        width={100}
                        height={100}
                      />
                    </div>
                  )}

                  <div
                    className={`flex flex-row items-center gap-4 text-center px-2 overflow-x-auto
                  ${positionData.length === 1 ? "justify-center" : ""}
                `}
                  >
                    {positionData.map((user) => (
                      <div
                        key={user.empId}
                        className="flex-shrink-0 w-50 min-w-[120px] flex flex-col items-center rounded-xl p-4"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <Image
                              src={componentPath("rank")}
                              alt="rank-badge"
                              width={30}
                              height={30}
                            />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs ">
                              {user.rank}
                            </div>
                          </div>
                          <div
                            className="relative"
                            onClick={() => handleSelectUser(user)}
                          >
                            {user.user ? (
                              <Avatar
                                key={user.empId}
                                src={user.user.pictureUrl}
                                size={100}
                                userId={user.user.userId}
                              />
                            ) : (
                              <Avatar
                                key={user.empId}
                                src={"/images/Avatar.jpg"}
                                size={100}
                              />
                            )}

                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px]">
                              <Image
                                src={componentPath("avatar")}
                                alt="avatar-badge"
                                width={100}
                                height={100}
                                className=""
                                style={{
                                  zIndex: 999,
                                }}
                              />
                            </div>
                          </div>
                          <div
                            className="relative"
                            onClick={() => handleSelectUser(user)}
                          >
                            <Image
                              src={componentPath("tag")}
                              alt="tag-badge"
                              width={160}
                              height={160}
                            />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-black w-full">
                              <p className="font-bold">{user.name}</p>
                              <p className="text-[10px]">{user.branch}</p>
                              <p>
                                KPI{" "}
                                <span className="font-bold">
                                  {user.achieve}%
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Divider
                    key={groupLabel}
                    sx={{
                      mb: 4,
                      mt: 2,
                      width: "80%",
                      borderBottomWidth: 2,
                      mx: "auto",
                      bgcolor: "#F2F2F2",
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        sx={{
          "& .MuiDialog-paper": {
            width: "70%",
          },
        }}
      >
        <UserPanel data={selectedUser} onClose={handleClose} />
      </Dialog>
    </div>
  );
}
