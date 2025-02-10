import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import useSWR from "swr";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlinePicture } from "react-icons/ai";
import moment from "moment";
import "moment/locale/th";
import { AppLayout } from "@/themes";

moment.locale('th');
const fetcher = url => axios.get(url).then(res => res.data);
const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const router = useRouter();

  const { data, error } = useSWR("/api/gallery", fetcher, {
    onSuccess: (data) => {
      setGallery(data.data);
    },
  });

  return (
    <div className="flex flex-col w-full">
      {/* HEADER */}
      <div className="flex flex-row bg-[#0056FF] p-2 items-center text-white w-full">
        <IoIosArrowBack size={25} onClick={() => router.back()} />
        <span className="text-2xl font-bold">Gallery</span>
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-wrap text-xs p-2 w-full">
        {gallery.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gray-200 rounded-lg p-2 mt-2 max-w-[120px] min-w-[120px] max-h-[150px] min-h-[180px]"
            onClick={() => router.push(`/gallery/${item._id}`)}
          >
            <AiOutlinePicture size={100} />
            <span className="text-[#0056FF] font-bold">{item.title}</span>
            <span className="text-xs font-light text-gray-500 line-clamp-1">{item.description}</span>
            <span className="text-xs self-start">{moment(item.createdAt).format("DD/MM/YYYY")}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
