import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import { IoChevronBackCircle, IoChevronForwardCircleSharp } from "react-icons/io5";
import { IoIosCloseCircle, IoIosDownload } from "react-icons/io";
import { Modal, CircularProgress } from "@mui/material";
import { AppLayout } from "@/themes";

const Gallery = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalLoading, setModalLoading] = useState(false);
  
    const folderId = "1txY4MczD4YcomdEtHJM5P5tCuagDDmRM";
    const apiKey = process.env.GOOGLE_API_KEY;
  
    useEffect(() => {
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
    }, [apiKey]);
  
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
    <div className="flex flex-col w-full p-2.5 mb-20 gap-2">
        <div className="flex flex-row gap-2 items-center mt-2">
            <IoIosArrowBack 
                size={30}
                onClick={() => router.back()}
                className="cursor-pointer"
            />
            <span className="text-xl text-[#0056FF] font-bold">Gallery</span>
        </div>
        <h1 className="text-xl font-bold">BM Bootcamp 9-10jul</h1>
        {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div
              key={file.id}
              className="cursor-pointer"
              onClick={() => handleOpenModal(index)}
            >
              {file.mimeType.startsWith("image/") && (
                <Image
                  src={`https://drive.google.com/uc?id=${file.id}&export=download`}
                  alt={file.name}
                  width={200}
                  height={200}
                  style={{ objectFit: "cover" }}
                />
              )}
              {file.mimeType.startsWith("video/") && (
                <video
                  style={{ width: "100%", height: "auto" }}
                  src={`https://drive.google.com/uc?id=${file.id}&export=download`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <Modal 
        open={modalOpen} 
        onClose={handleCloseModal}
    >
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
                    {files[currentIndex]?.mimeType.startsWith("image/") && (
                        <Image
                        src={`https://drive.google.com/uc?id=${files[currentIndex].id}`}
                        alt={files[currentIndex].name}
                        width={800}
                        height={800}
                        onLoad={() => setModalLoading(false)}
                        />
                    )}
                    {files[currentIndex]?.mimeType.startsWith("video/") && (
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
                            currentIndex === files.length - 1 &&
                            "opacity-50 pointer-events-none"
                        }`}
                        onClick={handleNext}
                        />
                    </div>
                </div>
                <div className="flex flex-row items-center mt-2 p-2">
                    <a
                        href={`https://drive.google.com/uc?id=${files[currentIndex]?.id}&export=download`}
                        download={files[currentIndex]?.name}
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
  );
};

export default Gallery;

Gallery.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Gallery.auth = true;