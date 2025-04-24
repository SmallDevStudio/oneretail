import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Loading from "@/components/Loading";
import { Divider, Slide, Dialog } from "@mui/material";
import MenuSection from "@/components/perf360/Sections/MenuSection";
import NewsSection from "@/components/perf360/Sections/NewsSection";
import PopupSection from "@/components/perf360/Sections/PopupSection";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Perf360() {
  const [menu, setMenu] = useState([]);
  const [news, setNews] = useState([]);
  const [popup, setPopup] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session ? session.user.id : null;

  useEffect(() => {
    if (status === "loading" || !session) return;
  }, [status, session]);

  useEffect(() => {
    if (popup.length > 0) {
      setOpenPopup(true);
    }
  }, [popup]);

  useEffect(() => {
    if (userId) {
      const useActivity = async () => {
        try {
          await axios.post(`/api/perf360/activity`, { userId });
        } catch (err) {
          console.error("Click tracking error:", err);
        }
      };
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useActivity();
    }
  }, [userId]);

  const {
    data: perfData,
    error,
    isLoading,
  } = useSWR(`/api/perf360?userId=${userId}`, fetcher, {
    revalidateOnMount: true,
    onSuccess: (data) => {
      setMenu(data.menu);
      setNews(data.news);
      setPopup(data.popup);
    },
  });

  console.log("menu", menu);

  const handleOpenPopup = () => setOpenPopup(true);
  const handleClosePopup = () => setOpenPopup(false);

  if (isLoading || !perfData || loading || error) return <Loading />;

  return (
    <div className="flex flex-col pb-20 w-full">
      {/* Header */}
      <div>
        <Image
          src="/dist/img/perf360-bg.png"
          alt="perf360"
          width={1000}
          height={1000}
          className="w-full object-contain"
        />
      </div>
      <div className="flex flex-row justify-center items-center font-['Ekachon'] gap-2 py-2 w-full">
        <div className="text-4xl">
          <span className="font-bold text-[#0056FF]">Perf</span>
          <span className="font-bold text-[#F2871F]">360</span>
        </div>
      </div>
      {/* Body */}
      <div className="flex flex-col gap-4 w-full">
        <MenuSection menu={menu} />
        <NewsSection data={news} />
      </div>

      <Dialog
        open={openPopup}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClosePopup}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            width: "100vw",
            maxWidth: "95vw", // ป้องกันไม่ให้มันจำกัดความกว้าง
            margin: 0,
            padding: 0,
            borderRadius: 2,
          },
        }}
      >
        <PopupSection
          data={popup}
          onClose={handleClosePopup}
          open={openPopup}
        />
      </Dialog>
    </div>
  );
}
