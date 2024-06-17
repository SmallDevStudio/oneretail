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
    const { data: loginData, error: loginError } = useSWR(() => userId ? `/api/loginreward/${userId}` : null, fetcher);
    const { data: settingData, error: settingError } = useSWR(`/api/settings`, fetcher);

    useEffect(() => {
        if (status === "loading") return; // ยังโหลด session อยู่
        if (!session) {
                router.push('login'); // ถ้า session ไม่มีหรือยังไม่ได้ login
        } else if (user && loginData && settingData) {
            if (!user) {
                router.push('/register');
            } else if (!loginData.receivedPointsToday) {
                router.push('/loginreward');
            } else if (settingData.data[0].survey) {
                router.push('/pulsesurvey');
            } else {
                router.push('/main');
            }
        }
    }, [session, status, user, loginData, settingData, router]);

    if (status === "loading" || !user || !loginData || !settingData) {
        return <Loading />;
    }
    if (userError || loginError || settingError) {
        return <div>Error loading data</div>;
    }

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
