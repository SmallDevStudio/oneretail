import React from "react";
import MainIconMenu from "@/components/MainIconMenu";
import FooterContant from "@/components/main/footContent";
import Loading from "@/components/Loading";
import AppLayout from "@/themes/Layout/AppLayout";
import dynamic from "next/dynamic";

const MainPage = () => {
    const Carousel = dynamic(() => import("@/components/Carousel"), {
        ssr: false,
        loading: () => <Loading />,
    });
   
    return (
        <>
            <main className="flex-1 flex-col bg-gray-10 justify-between items-center text-center min-h-[94vh] mb-20">
                <Carousel />
                <MainIconMenu />
                <div className="relative bottom-0">
                    <FooterContant />
                </div>
            </main>
            
            
        </>
    );
}

MainPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

MainPage.auth = true;

export default MainPage;

