import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import useSWR from "swr";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlinePicture } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import moment from "moment";
import "moment/locale/th";


moment.locale('th');
const fetcher = url => axios.get(url).then(res => res.data);
const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredGallery, setFilteredGallery] = useState([]);
  const router = useRouter();

  const { data, error } = useSWR("/api/gallery", fetcher, {
    onSuccess: (data) => {
      setGallery(data.data);
    },
  });

  useEffect(() => {
    if (search) {
      const filtered = gallery.filter((item) =>
        item?.title.toLowerCase().includes(search.toLowerCase()) ||
        item?.description.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredGallery(filtered);
    } else {
      setFilteredGallery(gallery);
    }
  }, [search, gallery]);

  return (
    <div className="flex flex-col w-full">
      {/* HEADER */}
      <div className="flex flex-row bg-[#0056FF] p-2 items-center text-white w-full">
        <IoIosArrowBack size={25} onClick={() => router.back()} />
        <span className="text-2xl font-bold">Gallery</span>
      </div>

      <div className="relative mx-2 mt-4">
        <input
          className="p-1 border border-gray-300 text-sm rounded-md w-full"
          placeholder="ค้นหา"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <IoSearchOutline size={20} className="text-gray-500"/>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-row flex-wrap text-xs gap-2 w-full">
        {gallery && filteredGallery.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-2 max-w-[30%] max-h-[150px] cursor-pointer"
            onClick={() => router.push(`/gallery/${item._id}`)}
          >
            <Image src="/images/folder.png" alt={item.title} width={100} height={100} />
            <span className="text-center text-xs line-clamp-2 overflow-hidden text-ellipsis break-words">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
