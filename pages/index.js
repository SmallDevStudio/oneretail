"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import CheckUser from "@/lib/hook/chckUsers";

const HomePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;
    const { isRegisterd } = CheckUser();

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(`/api/users/${userId}`, fetcher);

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

    if (error) return <div>Failed to load</div>;
    if (!data) return <Loading />;

    return <Loading />;
}

export default HomePage;

HomePage.auth = true;