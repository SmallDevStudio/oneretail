"use client"
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Loading from "@/components/Loading";
import CircularProgress from '@mui/material/CircularProgress';
import Head from "next/head";
import CheckUser from "@/lib/hook/chckUsers";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
    const { data: session} = useSession();
    const {isRegisterd} = CheckUser();
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();
    console.log('isRegisterd:', isRegisterd);
    const userId = session?.user?.id;
    const { data, error } = useSWR(`/api/users/${userId}`, fetcher);
    const user = data?.user;

    useEffect(() => {
        const storage = localStorage.getItem('isRegisterd');
        if (storage === 'true') {
            if (typeof window !== 'undefined'){
            localStorage.setItem('user', JSON.stringify(user));
            setIsLogin(false);
            router.push('/main');
            }
        } else {
            setIsLogin(false);
            router.push('/register');
        }
        }, [router, user])
   

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



    