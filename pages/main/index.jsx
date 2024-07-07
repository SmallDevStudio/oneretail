import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import Loading from "@/components/Loading";
import MainIconMenu from "@/components/MainIconMenu";
import FooterContant from "@/components/main/footContent";
import AppLayout from "@/themes/Layout/AppLayout";
import dynamic from "next/dynamic";
import Head from "next/head";
import RecheckUser from "@/components/RecheckUser";
import ManagerModal from "@/components/ManagerModal";

const Carousel = dynamic(() => import("@/components/Carousel"), {
    ssr: false,
    loading: () => <Loading />,
});

const fetcher = (url) => fetch(url).then((res) => res.json());

const manager = ['22392', '22393', '00000'];

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

        // Check if user is a manager and if they need to receive points
        if (manager.includes(user.user.empId)) {
            axios.get(`/api/manager/check?userId=${user.user.userId}`)
                .then(res => {
                    if (!res.data.hasLoggedIn) {
                        // Award points to the user
                        axios.post('/api/points/point', {
                            userId: session.user.id,
                            description: 'point พิเศษ',
                            contentId: null,
                            type: 'earn',
                            points: 100,
                        });

                        // Update the manager login record
                        axios.post('/api/manager', {
                            userId: session.user.id,
                            loginDate: new Date(),
                        });

                        // Show quiz modal
                        setShowModal(true);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [router, session, status, user, userError]);

    const onRequestClose = () => {
        setShowModal(false);
    };

    if (status === "loading" || !user) return <Loading />;
    if (userError) return <div>Error loading data</div>;

    return (
        <React.Fragment>
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
                    <ManagerModal isOpen={showModal} onRequestClose={onRequestClose} score={100} />
                </main>
            </RecheckUser>
        </React.Fragment>
    );
};

MainPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

MainPage.auth = true;

export default MainPage;
