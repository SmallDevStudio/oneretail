import Image from "next/image";
import { cropData } from "@/constants/crops";

export default function FarmGrid({ crops, onHarvest }) {
  return (
    <div className="grid grid-cols-5 gap-2 p-4">
      {crops.map((crop, index) => {
        const data = cropData[crop.type];
        const isGrown =
          Date.now() - new Date(crop.plantedAt).getTime() >=
          data.growTime * 1000;

        return (
          <div
            key={crop.id}
            className={`rounded p-2 text-center border ${
              isGrown ? "bg-green-200 cursor-pointer" : "bg-yellow-100"
            }`}
            onClick={() => isGrown && onHarvest(crop.id)}
          >
            <Image src={data.image} width={48} height={48} alt={data.name} />
            <p>{data.name}</p>
            <p>{isGrown ? "Ready!" : "Growing..."}</p>
          </div>
        );
      })}
    </div>
  );
}
