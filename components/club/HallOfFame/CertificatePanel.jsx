import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { MdFileDownload } from "react-icons/md";
import html2canvas from "html2canvas";

const cer = {
  improvement: "/images/hall-of-fame/e-cer/improvement.png",
  gold: "/images/hall-of-fame/e-cer/gold.png",
  platinum: "/images/hall-of-fame/e-cer/platinum.png",
  diamond: "/images/hall-of-fame/e-cer/diamond.png",
  ambassador: "/images/hall-of-fame/e-cer/ambassador.png",
  grand_ambassador: "/images/hall-of-fame/e-cer/grand_ambassador.png",
};

const month = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export default function CertificatePanel({ data, onClose }) {
  const [imgSrc, setImgSrc] = useState(data?.user?.pictureUrl);
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const cerRef = useRef();

  useEffect(() => {
    if (!data) return;
    if (status === "loading" || !session) return;
  }, [data, session, status]);

  const imagePath = () => {
    const type = data?.rewardtype;
    const key = type?.toLowerCase().replace(/\s/g, "_"); // "Grand Ambassador" → "grand_ambassador"
    const image = cer?.[key];
    return image || "";
  };

  const downloadAsImage = async () => {
    if (!cerRef.current) return;

    const canvas = await html2canvas(cerRef.current, {
      useCORS: true, // กรณีโหลดภาพจากโดเมนอื่น
      scale: 2, // ความคมชัดสูง
    });
    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `certificate-${data?.empId || "user"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full pb-2">
      {/* Header */}
      <div className="flex flex-row items-center justify-end gap-2 px-4 mt-2">
        <div className="border border-gray-300 rounded-lg">
          <MdFileDownload
            size={25}
            onClick={downloadAsImage}
            className="cursor-pointer bg-white rounded-lg p-1"
          />
        </div>
        <div className="border border-gray-300 rounded-lg">
          <IoClose
            size={25}
            onClick={onClose}
            className="cursor-pointer bg-white rounded-lg p-1"
          />
        </div>
      </div>
      <div>
        {data && data.rewardtype && (
          <div ref={cerRef} className="flex flex-col items-center">
            <div className="relative">
              <img
                src={imagePath()}
                alt={data?.rewardtype}
                style={{ width: "350px", height: "auto" }}
              />
            </div>
            <div className="absolute top-[27%] left-[50%] translate-x-[-50%] flex flex-col items-center justify-center">
              <p className="text-sm font-bold">
                {month[data?.month]} {data?.year}
              </p>
            </div>
            <div className="absolute top-[40%] left-[50%] translate-x-[-50%] flex flex-col items-center justify-center">
              {data.user ? (
                <img
                  src={imgSrc}
                  alt={data?.user?.fullname}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "9999px",
                    border: "0.5px solid #9d9d9d",
                    marginBottom: "-4px", // ✅ ลดระยะห่างด้านล่างของรูป
                  }}
                  onError={() => {
                    setImgSrc("/images/Avatar.jpg");
                  }}
                />
              ) : (
                <img
                  src={"/images/Avatar.jpg"}
                  alt={data?.empId}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "9999px",
                    border: "0.5px solid #9d9d9d",
                    marginBottom: "-4px", // ✅ ลดระยะห่างด้านล่างของรูป
                  }}
                />
              )}
              <div className="flex flex-col items-center mt-1 w-full">
                <p className="text-sm font-bold">
                  {data?.name || data?.user?.fullname}
                </p>
                <p className="text-xs">
                  {data?.branch || data?.team || data?.zone}
                </p>
                <p className="text-xs font-bold">KPI: {data?.achieve}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
