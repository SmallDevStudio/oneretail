"use client";
import { useSession } from "next-auth/react";
import useFarm from "@/hooks/useFarm";
import FarmGrid from "@/components/one-farm/FarmGrid";

export default function FarmPage() {
  const { data: session } = useSession();
  const farm = useFarm(session?.user?.id);

  const handleHarvest = (cropId) => {
    console.log("Harvest crop", cropId);
    // TODO: ส่งไปยัง API ลบ crop + เพิ่มของใน barn
  };

  if (!session) return <div>Loading...</div>;
  if (!farm) return <div>Loading farm...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Farm</h1>
      <FarmGrid crops={farm.crops} onHarvest={handleHarvest} />
    </div>
  );
}
