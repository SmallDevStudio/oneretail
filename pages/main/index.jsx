"use client"
import React from "react";
import MainIconMenu from "@/components/MainIconMenu";
import FooterContant from "@/components/main/footContent";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import dynamic from "next/dynamic";
import { AppLayout } from "@/themes";
import Head from "next/head";
import { useSession } from "next-auth/react";
import CheckUser from "@/lib/hook/chckUsers";

export default function MainPage() {
    const Carousel = dynamic(() => import("@/components/Carousel"), {
        ssr: false,
        loading: () => <Loading />,
    });
    const { data: session, status } = useSession();
    const { isRegisterd } = CheckUser();
    console.log('session:', session);
    
    return (
        <>
            <Head>
                <title>One Retail</title>
                <meta http-equiv="Permissions-Policy" content="interest-cohort=()" />
            </Head>
            <main className="flex flex-col bg-gray-10">
                <div className="relative">
                   <Carousel />
                </div>
                <div className="relative p-5 flex items-center text-center justify-center mt-2 ">
                    <MainIconMenu />
                </div>
                <div className="mt-2">
                    <FooterContant />
                </div>
            </main>
        </>
    );
}

MainPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
MainPage.auth = true;