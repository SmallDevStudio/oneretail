import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function PopupSection({ data, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const getImageSrc = (image) => {
    if (!image || typeof image !== "object") return "/dist/img/simple.png";
    if (!image.url || image.url === "") return "/dist/img/simple.png";
    return image.url;
  };

  const handleLink = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const currentItem = data[currentIndex];

  return (
    <div className="flex flex-col items-center py-4 gap-4 w-full px-4">
      {currentItem && (
        <>
          <h2 className="text-lg font-bold text-center mb-2">
            {currentItem.title}
          </h2>

          <div className="flex flex-row gap-4 w-full">
            <div
              className="tiptap w-full"
              dangerouslySetInnerHTML={{ __html: currentItem.content }}
            />

            <div className="shrink-0 w-[100px] h-auto relative">
              <Image
                src={getImageSrc(currentItem.image)}
                alt={currentItem.title}
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </div>

          {/* ปุ่มดูรายละเอียด */}
          <div className="mt-4 flex justify-center gap-4 w-full">
            <button
              className="bg-[#0056FF] text-white font-bold py-2 px-4 border border-gray-100 rounded-lg max-w-xs"
              onClick={() => handleLink(currentItem.url)}
            >
              ดูรายละเอียด
            </button>

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
