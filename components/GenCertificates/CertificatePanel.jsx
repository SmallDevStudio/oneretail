import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { FaDownload } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";
import { toast } from "react-toastify";
import Loading from "./Loading";
import { IoIosCloseCircle } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TbZoomScan } from "react-icons/tb";
import { TbZoomCancel } from "react-icons/tb";

moment.locale("th");

export default function CertificatePanel(props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    setCertificate(props.certificate);
  }, [props.certificate]);

  useEffect(() => {
    if (certificate) {
      setLoading(true);
      html2canvas(certificate).then((canvas) => {
        setImage(canvas.toDataURL("image/png"));
        setLoading(false);
      });
    }
  }, [certificate]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <IoIosArrowBack
                className="text-3xl text-gray-500 cursor-pointer"
                onClick={() => {
                  props.onClose();
                }}
              />
              <h1 className="text-2xl font-bold text-gray-500">ใบรับรอง</h1>
            </div>
            <div className="flex flex-row items-center gap-2">
              <button
                onClick={() => {
                  props.onClose();
                }}
                className="flex bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded h-10 items-center text-center cursor-pointer"
              >
                ปิด
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div
              ref={certificate}
              className="flex flex-col items-center justify-center"
            >
              {certificate && (
                <>
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src={certificate.toDataURL()}
                      alt="certificate"
                      width={1000}
                      height={1000}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
