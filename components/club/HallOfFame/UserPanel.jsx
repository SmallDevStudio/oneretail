import { useState, useEffect } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

export default function UserPanel({ data, onClose }) {
  const [user, setUser] = useState(null);

  return (
    <div>
      {/* Header */}
      <div>
        <IoClose size={30} onClick={onClose} className="cursor-pointer" />
      </div>
      {/* Body */}
      <div className="p-4">
        <div className="flex flex-col items-center">
          <Image
            src={data?.user?.pictureUrl}
            alt={data?.user?.fullname}
            width={150}
            height={150}
            className="rounded-full object-cover"
            style={{ width: "150px", height: "150px" }}
          />
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
        </div>
      </div>
    </div>
  );
}
