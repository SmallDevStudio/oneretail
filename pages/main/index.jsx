import React from "react";
import MainIconMenu from "@/components/MainIconMenu";
import FooterContant from "@/components/main/footContent";
import Loading from "@/components/Loading";
import AppLayout from "@/themes/Layout/AppLayout";
import dynamic from "next/dynamic";
import Head from "next/head";

const Carousel = dynamic(() => import("@/components/Carousel"), {
    ssr: false,
    loading: () => <Loading />,
});

const MainPage = () => {
    return (
        <React.Fragment>
            <Head>
                <title>One Retail</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/dist/icons/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/dist/icons/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/dist/icons/favicon-16x16.png"/>
                <link rel="manifest" href="/manifest.json"/>
            </Head>
            <main className="flex flex-col bg-gray-10 justify-between items-center text-center min-h-screen">
                <div className="w-full">
                    <Carousel />
                </div>
                <div className="flex-grow flex items-center justify-center">
                    <MainIconMenu />
                </div>
                <div className="relative bottom-0 w-full footer-content">
                    <FooterContant />
                </div>
            </main>
        </React.Fragment>
    );
};

MainPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

MainPage.auth = true;

export default MainPage;
