"use client"
import React from "react";
import MainIconMenu from "@/components/MainIconMenu";
import FooterContant from "@/components/main/footContent";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import dynamic from "next/dynamic";
import { AppLayout } from "@/themes";

export default function MainPage() {
    const Carousel = dynamic(() => import("@/components/Carousel"), {
        ssr: false,
        loading: () => <Loading />,
    })
    
    return (
        <>
            <main className="flex flex-col w-[100vw] h-[100vh] bg-gray-100 dark:bg-gray-900">
                <div >
                   <Carousel />
                </div>
                <div className="relative p-5 flex items-center text-center justify-center mt-2 px-12 py-4">
                    <MainIconMenu />
                </div>
                <div className="mt-2 mb-[60px]">
                    <FooterContant />
                </div>
            </main>
        </>
    );
}

MainPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
MainPage.auth = true;