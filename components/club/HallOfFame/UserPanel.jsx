import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { Slide, Dialog } from "@mui/material";
import CertificatePanel from "./CertificatePanel";
import Avatar from "@/components/utils/Avatar";
import { useSession } from "next-auth/react";
import { RiHandCoinLine } from "react-icons/ri";
import { PiCertificate } from "react-icons/pi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UserPanel({ data, onClose }) {
  const [openCer, setOpenCer] = useState(false);
  const [hasPoint, setHasPoint] = useState(true);

  const { data: session, status } = useSession();

  const userId = session?.user?.id;

  useEffect(() => {
    if (!data) return;
    if (status === "loading" || !session) return;
    if (data && userId) {
      const fetchPoint = async () => {
        const res = await axios.get(
          `/api/club/hall-of-fame/get-points?halloffameId=${data._id}&userId=${userId}`
        );
        if (res.data.data.length > 0) {
          setHasPoint(true);
        } else {
          setHasPoint(false);
        }
      };
      fetchPoint();
    }
  }, [data, session, status, userId]);

  const handleGetPoint = async (id, point) => {
    const data = {
      halloffameId: id,
      points: point,
      userId: userId,
    };

    try {
      await axios.post(`/api/club/hall-of-fame/get-points`, data);
      setHasPoint(true);
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

  return (
    <div className="w-full min-w-[60vw]">
      {/* Header */}
      <div>
        <IoClose size={30} onClick={onClose} className="cursor-pointer" />
      </div>
      {/* Body */}
      <div className="p-4">
        <div className="flex flex-col items-center">
          {data?.user ? (
            <Avatar
              src={data.user.pictureUrl}
              size={100}
              userId={data.user.userId}
            />
          ) : (
            <Avatar src={"/images/Avatar.jpg"} size={100} />
          )}
        </div>
        <div className="text-center mt-4">
          <p className="font-bold text-lg text-[#0056FF]">{data?.rewardtype}</p>
          <p className="font-bold text-sm">
            Rank: <span>{data?.rank}</span>
          </p>
          <p className="font-bold">{data?.name}</p>
          <p className="font-bold">{data?.region}</p>
          <p className="text-sm">{data?.branch}</p>
          <p className="text-sm">{data?.zone}</p>
          <p>
            KPI: <span className="font-bold">{data?.achieve}</span>
          </p>
          {userId === data?.user?.userId && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                className="border border-gray-300 rounded-lg bg-gray-200 p-1"
                onClick={() => setOpenCer(true)}
              >
                <PiCertificate size={22} />
              </button>
              {!hasPoint && (
                <button
                  className="border border-gray-300 rounded-lg bg-gray-200 p-1"
                  onClick={() => handleGetPoint(data._id, data.points)}
                >
                  <RiHandCoinLine size={22} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={openCer}
        TransitionComponent={Transition}
        onClose={() => setOpenCer(false)}
        sx={{
          "& .MuiDialog-paper": {
            width: "100vw",
            maxWidth: "100%",
            padding: "0px",
            margin: "0px",
            background: "transparent",
          },
        }}
      >
        <CertificatePanel data={data} onClose={() => setOpenCer(false)} />
      </Dialog>
    </div>
  );
}
