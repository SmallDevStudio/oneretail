"use client"
import AppMenu from "@/components/menu/AppMenu";
import MainIconMenu from "@/components/MainIconMenu";
import FooterContant from "@/components/main/footContent";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import dynamic from "next/dynamic";

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
                <div className="relative p-5 flex items-center text-center justify-center mt-5 px-1 pz-1">
                    <MainIconMenu />
                </div>
                <div className="mt-10">
                    <FooterContant />
                </div>
            </main>
            <nav>
                <AppMenu />
            </nav>
        </>
    );
}