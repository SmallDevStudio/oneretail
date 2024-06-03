"use client"
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Loading from "@/components/Loading";
import CircularProgress from '@mui/material/CircularProgress';
import Head from "next/head";
import CheckUser from "@/lib/hook/chckUsers";

export default function Home() {
    const { data: session} = useSession();
    const {isRegisterd} = CheckUser();
    const router = useRouter();

    console.log('isRegisterd:', isRegisterd);

    useEffect(() => {
        const userStorager = localStorage.getItem('user');
        if (userStorager === null) {
            const userId = session.user.id;
            const fetchUser = async () => {
                const res = await fetch('/api/users/'+userId);
                const data = await res.json();
                if (data) {
                    localStorage.setItem('user', JSON.stringify(data));
                    router.push('/main');
                } else {
                    localStorage.setItem('isRegisterd', false);
                    router.push('/register');
                }
            };
            fetchUser();
            } else {
              router.push('/main');  
        }
    }, [router, session.user.id]);

    useEffect(() => {
        if (!isRegisterd) {
            router.push('/register');
        }
    }, [isRegisterd, router]);

    return (
        <>
            <Head>
                <title>One Retail</title>
            </Head>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <div className='text-center justify-center items-center'>
                    <div className='flex mb-10'>
                        <Image src="/dist/img/logo-one-retail.png" alt="one Retail Logo" width={150} height={150} priority/>
                    </div>
                    <CircularProgress />
                </div>
            </div>
        </>
    )
}

Home.auth = true;

    