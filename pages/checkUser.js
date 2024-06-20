// pages/checkUser.js
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Loading from "@/components/Loading";

const fetcher = (url) => fetch(url).then((res) => res.json());

const CheckUser = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    const { data: user, error: userError } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);

    useEffect(() => {
        if (!session) {
            router.push('/login');
            return;
        }
        if (!user && !userError) return; // Still loading
        if (userError || !user) {
            router.push('/register');
        } else {
            router.push('/checkLoginReward');
        }
    }, [session, user, userError, router]);

    if (!user && !userError) return <Loading />;
    if (userError) return <div>Error loading user data</div>;

    return <Loading />;
};

export default CheckUser;

CheckUser.auth = true;
