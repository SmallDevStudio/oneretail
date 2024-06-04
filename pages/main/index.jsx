"use client"
import React from "react";
import MainIconMenu from "@/components/MainIconMenu";
import FooterContant from "@/components/main/footContent";
import Loading from "@/components/Loading";
import dynamic from "next/dynamic";
import { AppLayout } from "@/themes";
import Head from "next/head";
import { useSession } from "next-auth/react";
import CheckUser from "@/lib/hook/chckUsers";
import withAuthCheck from "@/lib/hook/withAuthCheck";

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

            <main className="flex-1 flex-col bg-gray-10 justify-between items-center text-center h-full">
                <Carousel />
                <MainIconMenu />
            </main>
            <div className="flex-1 pb-16">
                <FooterContant />
            </div>
            
        </>
    );
}


MainPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
MainPage.auth = true;


