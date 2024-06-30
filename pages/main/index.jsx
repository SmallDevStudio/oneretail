import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Loading from "@/components/Loading";
import MainIconMenu from "@/components/MainIconMenu";
import FooterContant from "@/components/main/footContent";
import AppLayout from "@/themes/Layout/AppLayout";
import dynamic from "next/dynamic";
import Head from "next/head";
import RecheckUser from "@/components/RecheckUser";
import LineModal from "@/components/LineModal";

const Carousel = dynamic(() => import("@/components/Carousel"), {
    ssr: false,
    loading: () => <Loading />,
});

const fetcher = (url) => fetch(url).then((res) => res.json());

const MainPage = () => {
    const { data: session, status } = useSession();
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const userId = session?.user?.id;

    const { data: user, error: userError } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);

    useEffect(() => {
        if (status === "loading" || !session || !user) return;
        if (userError || !user || user?.user === null) {
            router.push('/register');
            return;
        }

        // Show modal 1-2 seconds after page load
        const timer = setTimeout(() => {
            setShowModal(false);
        }, 1500); // 1.5 seconds

        return () => clearTimeout(timer);
    }, [router, session, status, user, userError]);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (status === "loading" || !user) return <Loading />;
    if (userError) return <div>Error loading data</div>;

    return (
        <React.Fragment>
            <Head>
                <title>One Retail</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/dist/icons/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/dist/icons/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/dist/icons/favicon-16x16.png"/>
                <link rel="manifest" href="/manifest.json"/>
            </Head>
            <RecheckUser>
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
                    <LineModal showModal={showModal} handleCloseModal={handleCloseModal} />
                </main>
            </RecheckUser>
        </React.Fragment>
    );
};

MainPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

MainPage.auth = true;

export default MainPage;
