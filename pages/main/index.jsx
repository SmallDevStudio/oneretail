import React from "react";
import MainIconMenu from "@/components/MainIconMenu";
import FooterContant from "@/components/main/footContent";
import Loading from "@/components/Loading";
import AppLayout from "@/themes/Layout/AppLayout";
import dynamic from "next/dynamic";
import Head from "next/head";

const MainPage = () => {
    const Carousel = dynamic(() => import("@/components/Carousel"), {
        ssr: false,
        loading: () => <Loading />,
    });
   
    return (
        <React.Fragment>
            <Head>
                <title>One Retail</title>
                <link rel="apple-touch-icon" sizes="180x180" href="dist/icons/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="dist/icons/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="dist/icons/favicon-16x16.png"/>
                <link rel="manifest" href="/webmanifest"></link>
            </Head>
            <main className="flex-1 flex-col bg-gray-10 justify-between items-center text-center min-h-[94vh] mb-20">
                <Carousel />
                <MainIconMenu />
                <div className="relative bottom-0">
                    <FooterContant />
                </div>
            </main>
            
            
        </React.Fragment>
    );
}

MainPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

MainPage.auth = true;

export default MainPage;

