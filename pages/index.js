"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import Head from "next/head";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const HomePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    const { data: user, error: userError } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);
    const { data: loginReward, error: loginRewardError } = useSWR(() => userId ? `/api/loginreward/${userId}` : null, fetcher);

    useEffect(() => {
        console.log("Session status:", status);
        console.log("Session data:", session);
        console.log("User data:", user);
        console.log("LoginReward data:", loginReward);

        if (status === "loading") return; // ยังโหลด session อยู่
        if (!session) {
            router.push('/login'); // ถ้า session ไม่มีหรือยังไม่ได้ login
            return;
        }
        if (user === undefined) return; // กำลังโหลด user data อยู่
        if (user?.user === null) {
            router.push('/register'); // ถ้าไม่มี user data ให้ไปที่ /register
            return;
        }
        if (loginReward === undefined) return; // กำลังโหลด login reward data อยู่
        if (loginReward) {
            if (loginReward.receivedPointsToday) {
                router.push('/main'); // ถ้าได้รับ login reward แล้วไปที่ /main
            } else {
                router.push('/loginreward'); // ถ้ายังไม่ได้รับ login reward ไปที่ /loginreward
            }
        }
    }, [router, session, status, user, userError, loginReward, loginRewardError]);

    if (status === "loading" || user === undefined || loginReward === undefined) return <Loading />;
    if (userError || loginRewardError) return <div>Error loading data</div>;

    return (
        <React.Fragment>
            <Head>
                <title>One Retail</title>
                <link rel="apple-touch-icon" sizes="180x180" href="dist/icons/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="dist/icons/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="dist/icons/favicon-16x16.png"/>
                <link rel="manifest" href="/manifest.json"></link>
            </Head>
            <Loading />
        </React.Fragment>
    );
}

export default HomePage;

HomePage.auth = true;
