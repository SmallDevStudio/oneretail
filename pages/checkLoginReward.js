// pages/checkLoginReward.js
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Loading from "@/components/Loading";

const fetcher = (url) => fetch(url).then((res) => res.json());

const CheckLoginReward = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    const { data: loginReward, error: loginRewardError } = useSWR(() => userId ? `/api/loginreward/${userId}` : null, fetcher);

    useEffect(() => {
        if (!session) {
            router.push('/login');
            return;
        }

        if (!loginReward) return; // Still loading

        if (loginReward && loginReward.receivedPointsToday === false) {
            router.push('/loginreward');
        } else {
            router.push('/checkSurvey');
        }
    }, [session, loginReward, loginRewardError, router]);

    if (!loginReward && !loginRewardError) return <Loading />;
    if (loginRewardError) return <div>Error loading login reward data</div>;

    return <Loading />;
};

export default CheckLoginReward;

CheckLoginReward.auth = true;
