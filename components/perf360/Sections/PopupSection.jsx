import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function PopupSection({ data, onClose, open }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewed, setViewed] = useState(false);
  const timerRef = useRef(null);
  const router = useRouter();
  const currentItem = data[currentIndex];

  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!currentItem || !userId || viewed) return;

    setViewed(false); // reset view flag
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        await axios.post("/api/perf360/popup/activity", {
          popupId: currentItem._id,
          userId,
          activity: "view",
        });
        setViewed(true);
      } catch (err) {
        console.error("View tracking error:", err);
      }
    }, 5000);

    return () => clearTimeout(timerRef.current);
  }, [currentIndex, currentItem, userId, viewed]);

  const handleLink = async (url) => {
    if (!url || !currentItem || !userId) return;
    try {
      await axios.post("/api/perf360/popup/activity", {
        popupId: currentItem._id,
        userId,
        activity: "click",
      });
    } catch (err) {
      console.error("Click tracking error:", err);
    }
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col items-center py-4 gap-4 w-full px-4">
      {currentItem && (
        <>
          <h2 className="text-lg font-bold text-center mb-2">
            {currentItem.title}
          </h2>

          <div className="flex flex-col items-center gap-2 w-full">
            {currentItem.image?.url && (
              <div className="flex w-[300px] h-auto relative">
                <Image
                  src={currentItem.image.url}
                  alt={currentItem.title}
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>
            )}
            <div
              className="tiptap w-full"
              dangerouslySetInnerHTML={{ __html: currentItem.content }}
            />
          </div>

          {/* ปุ่มดูรายละเอียด */}
          <div className="mt-4 flex justify-center gap-4 w-full">
            {currentItem.url && (
              <button
                className="bg-[#0056FF] text-white font-bold py-2 px-4 border border-gray-100 rounded-lg max-w-xs"
                onClick={() => handleLink(currentItem.url)}
              >
                ดูรายละเอียด
              </button>
            )}

            {currentIndex === data.length - 1 && (
              <button
                className="bg-gray-300 text-black font-bold py-2 px-4 border border-gray-100 rounded-lg"
                onClick={onClose}
              >
                ปิดหน้าต่างนี้
              </button>
            )}
          </div>

          {/* ปุ่มเลื่อน หรือ ปิด */}
          {data.length > 1 && (
            <div className="flex flex-row justify-between items-center gap-4 w-full mt-4">
              <button
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                disabled={currentIndex === 0}
                className={`flex items-center justify-center bg-gray-200 rounded-full w-10 h-10 ${
                  currentIndex === 0
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-300"
                }`}
              >
                <IoIosArrowBack size={24} />
              </button>

              <div className="">
                {currentIndex + 1} / {data.length}
              </div>

              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                disabled={currentIndex === data.length - 1}
                className={`flex items-center justify-center bg-gray-200 rounded-full w-10 h-10 ${
                  currentIndex === data.length - 1
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-300"
                }`}
              >
                <IoIosArrowForward size={24} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
