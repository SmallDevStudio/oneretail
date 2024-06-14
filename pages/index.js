"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import CheckUser from "@/lib/hook/chckUsers";
import Head from "next/head";

const HomePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;
    const { isRegisterd } = CheckUser();

    useEffect(() => {
        if (!session) return; // Wait for session data to be available
        const checkUserRegistration = async () => {
            const storage = localStorage.getItem('isRegisterd');
            if (storage === 'true') {
                router.push('/loginreward');
            } else {
                router.push('/register');
            }
        };
        checkUserRegistration();
    }, [session, router]);

    return (
        <React.Fragment>
            <Head>
                <title>One Retail</title>
                <link rel="apple-touch-icon" sizes="180x180" href="dist/icons/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="dist/icons/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="dist/icons/favicon-16x16.png"/>
                <link rel="manifest" href="/webmanifest"></link>
            </Head>
            <Loading />
        </React.Fragment>
    );
}

export default HomePage;

HomePage.auth = true;