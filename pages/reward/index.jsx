import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import RewardPanal from "@/components/reward/RewardPanal";
import Loading from "@/components/Loading";

export default function Reward() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isReward, setIsReward] = useState(false);

  return <RewardPanal />;
}
