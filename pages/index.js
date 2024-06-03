'use client'
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Loading from "@/components/Loading";
import CircularProgress from '@mui/material/CircularProgress';
import Head from "next/head";
import CheckUser from "@/lib/hook/chckUsers";
import useSWR from "swr";

export default function Home() {
    const { data: session} = useSession();
    const router = useRouter();
    const userId = session?.user?.id;
   
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUser();
    }, []);


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



    