import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import {
  IoChevronBackCircle,
  IoChevronForwardCircleSharp,
} from "react-icons/io5";
import { IoIosCloseCircle, IoIosDownload } from "react-icons/io";
import { Modal, CircularProgress } from "@mui/material";
import Loading from "@/components/Loading";
import moment from "moment";
import "moment/locale/th";

moment.locale("th");

const extractFolderId = (url) => {
  const regex = /\/folders\/([a-zA-Z0-9-_]+)/;
  const match = url?.match(regex);
  return match ? match[1] : null;
};

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

const Gallery = () => {
  const [files, setFiles] = useState([]);
  const [gallery, setGallery] = useState(null);
  const [driveUrl, setDriveUrl] = useState("");
  const [folderId, setFolderId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      const res = await axios.get(`/api/gallery/${id}`);
      setGallery(res.data.data);
      setLoading(false);
    };
    if (id) {
      fetchGallery();
    }
  }, [id]);

  useEffect(() => {
    if (gallery) {
      const id = extractFolderId(gallery.googleDriveUrl);
      setDriveUrl(gallery.googleDriveUrl);
      setFolderId(id);
    }
  }, [driveUrl, gallery]);

  useEffect(() => {
    if (!folderId) return;
    const fetchFiles = async () => {
      setLoading(true);
      const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setFiles(data.files);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, apiKey]);

  const handleOpenModal = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleNext = () => {
    if (currentIndex < files.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-row bg-[#0056FF] gap-2 p-2 text-white items-center">
            <IoIosArrowBack
              size={30}
              onClick={() => router.back()}
              className="cursor-pointer"
            />
            <span className="text-lg text-white font-bold">Gallery</span>
          </div>
          <div className="flex flex-col p-2">
            <p className="text-lg font-bold">{gallery?.title}</p>
            <span className="text-sm text-gray-700">
              {gallery?.description}
            </span>
            <span className="text-sm text-gray-500">
              {moment(gallery?.createdAt).format("LL")}
            </span>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
              {files?.map((file, index) => (
                <div
                  key={file.id}
                  className="cursor-pointer w-full"
                  onClick={() => handleOpenModal(index)}
                >
                  {file.mimeType.startsWith("image/") && (
                    <div className="w-full aspect-square relative overflow-hidden rounded-md">
                      <Image
                        src={`https://drive.google.com/uc?id=${file.id}&export=download`}
                        alt={file.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  {file.mimeType.startsWith("video/") && (
                    <div className="w-full aspect-square relative overflow-hidden rounded-md">
                      <video
                        src={`https://drive.google.com/uc?id=${file.id}&export=download`}
                        className="object-cover w-full h-full"
                        muted
                        playsInline
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <Modal open={modalOpen} onClose={handleCloseModal}>
            <div className="bg-black bg-opacity-75 flex flex-col justify-center items-center h-screen">
              <div>
                <div className="flex flex-row justify-end mb-2">
                  <IoIosCloseCircle
                    size={30}
                    className="text-white cursor-pointer"
                    onClick={handleCloseModal}
                  />
                </div>
                <div className="relative">
                  {files &&
                    files[currentIndex]?.mimeType.startsWith("image/") && (
                      <Image
                        src={`https://drive.google.com/uc?id=${files[currentIndex].id}`}
                        alt={files[currentIndex].name}
                        width={800}
                        height={800}
                        onLoad={() => setModalLoading(false)}
                      />
                    )}
                  {files &&
                    files[currentIndex]?.mimeType.startsWith("video/") && (
                      <video
                        controls
                        autoPlay
                        style={{ maxWidth: "800px", maxHeight: "800px" }}
                        src={`https://drive.google.com/uc?id=${files[currentIndex].id}`}
                        onLoadedData={() => setModalLoading(false)}
                      />
                    )}
                  <div className="absolute top-1/2 transform -translate-y-1/2 left-4">
                    <IoChevronBackCircle
                      size={30}
                      className={`text-white cursor-pointer ${
                        currentIndex === 0 && "opacity-50 pointer-events-none"
                      }`}
                      onClick={handleBack}
                    />
                  </div>
                  <div className="absolute top-1/2 transform -translate-y-1/2 right-4">
                    <IoChevronForwardCircleSharp
                      size={30}
                      className={`text-white cursor-pointer ${
                        currentIndex === files?.length - 1 &&
                        "opacity-50 pointer-events-none"
                      }`}
                      onClick={handleNext}
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center mt-2 p-2">
                  <a
                    href={`https://drive.google.com/uc?id=${
                      files ? files[currentIndex]?.id : ""
                    }&export=download`}
                    download={files ? files[currentIndex]?.name : ""}
                    className="text-white flex items-center cursor-pointer"
                  >
                    <IoIosDownload size={30} />
                    <span className="ml-2">Download</span>
                  </a>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Gallery;
