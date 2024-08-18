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
import RecheckUser from "@/components/RecheckUser";
import ManagerModal from "@/components/ManagerModal";
import PilotModal from "@/components/PilotModal";
import UserPanel from "@/components/main/UserPanel";
import MenuPanel from "@/components/main/MenuPanel";
import LinkModal from "@/components/LinkModal";
import Image from "next/image";
import BirthDayModal from "@/components/BirthDayModal";

const Carousel = dynamic(() => import("@/components/Carousel"), {
    ssr: false,
    loading: () => <Loading />,
});

const fetcher = (url) => fetch(url).then((res) => res.json());

const manager = ['22392', '20569', '56428', '23782',
    '11213',
    '10483',
    '11544',
    '12857',
    '22590',
    '80220',
    '80003',
    '81195',
    '81200',
    '81196',
    '81197',
    '81198',
    '81199',
    '86486',
    '43949',
    '24653',
    '33008'
     ];

     const CoinsPilot = [
        '87349', '86592', '60272', '86629', '86570', '60397', '60999', '86548', '53061', '86611', '86639', '61491', '86579', 
        '53645', '86311', '86572', '86589', '56404', '86606', '86633', '58210', '86607', '56641', '86315', '56209', '86631', 
        '86609', '86577', '86612', '59021', '86613', '86593', '60271', '86632', '55801', '86623', '86638', '57796', '58079', 
        '86590', '86622', '86584', '86575', '86561', '86318', '86313', '86614', '57672', '86562', '87703', '86549', '55233', 
        '87008', '86587', '86591', '55789', '56255', '61246', '57208', '86563', '58201', '86610', '54111', '56399', '86578', 
        '86621', '56257', '54784', '85954', '57798', '86627', '86573', '58107', '56381', '86588', '86615', '86569', '58115', 
        '86312', '86608', '61080', '86635', '55235', '56214', '60203', '86574', '56390', '86229', '58818', '56354', '55232', 
        '86567', '54785', '55786', '85920', '86568', '86586', '85919', '86585', '55074', '86316', '53074', '85918', '85925', 
        '85931', '56388', '58897', '85933', '53093', '83685', '59390', '61180', '86327', '86329', '58822', '15755', '16156', 
        '26949', '80354', '80823', '18046', '80232', '81427', '80258', '80367', '19501', '15449', '80372', '60749', '59634', 
        '82483', '83438', '54650', '11386', '83745', '48904', '83443', '82490', '27158', '83460', '61390', '11936', '58893', 
        '54259', '41615', '55702', '30242', '83549', '83719', '85610', '20421', '60142', '26431', '85712', '82414', '19535', 
        '82475', '59274', '51431', '82069', '53302', '83768', '59555', '81622', '53275', '82873', '83723', '34381', '83762', 
        '85294', '54182', '54356', '54251', '81654', '19174', '60792', '83422', '83497', '83457', '54109', '83458', '29770', 
        '81636', '60785', '83463', '59215', '60690', '58906', '55674', '50568', '83499', '82854', '84712', '10457', '82520', 
        '55377', '83414', '26757', '14476', '51509', '54349', '56061', '83469', '59724', '50960', '85301', '83470', '83712', 
        '55061', '59096', '46716', '83756', '83461', '83739', '83472', '83423', '83444', '82531', '83727', '83210', '83213', 
        '53995', '59475', '45124', '56051', '83214', '83720', '82637', '60398', '59877', '54870', '83547', '26319', '54647', 
        '55543', '82484', '82355', '11021', '45238', '82514', '20412', '49030', '80739', '83495', '57322', '44570', '83721', 
        '47535', '47533', '83751', '60015', '85297', '56704', '60140', '54094', '33451', '85724', '85298', '83498', '83486', 
        '8728', '85258', '83749', '83564', '83366', '83711', '45366', '57026', '50281', '82657', '61227', '61163', '42908', 
        '20066', '83717', '54141', '15727', '44683', '83566', '40692', '83748', '54976', '32264', '50268', '82883', '83548', 
        '50955', '85286', '85287', '61387', '85714', '85289', '28537', '52258', '60946', '83722', '83206', '55675', '60554', 
        '83761', '61101', '83743', '43501', '85288', '30889', '52693', '61005', '41520', '55546', '83563', '83738', '48114', 
        '33065', '11422', '80943', '52704', '55496', '55552', '85719', '83327', '83233', '60412', '82956', '83627', '17929', 
        '60497', '45798', '85293', '55004', '83764', '83763', '55834', '59831', '47143', '56678', '55917', '60292', '85708', 
        '27147', '27816', '56080', '83625', '81635', '45993', '81634', '51914', '85250', '83765', '59642', '48800', '85601', 
        '20025', '18345', '42704', '83426', '25499', '55878', '56279', '82500', '51518', '80751', '52685', '82515', '85600', 
        '82545', '83467', '82660', '29684', '55979', '82505', '50540', '83416', '59786', '83483', '59619', '32784', '50620', 
        '57171', '57079', '50998', '54671', '83417', '83435', '83718', '57748', '32921', '50692', '83437', '83453', '83442', 
        '83388', '45529', '83441', '34145', '83425', '34407', '40031', '51435', '83445', '83427', '41949', '83760', '42840', 
        '55832', '46240', '45565', '83432', '17797', '45225', '46253', '33064', '83439', '82492', '82474', '82486', '51430', 
        '82510', '60603', '51173', '83459', '10123', '82488', '47930', '44791', '83419', '61228', '34400', '59510', '85604', 
        '17925', '14473', '85611', '82511', '52036', '82541', '27679', '10124', '83473', '85711', '60141', '11419', '57144', 
        '58908', '56224', '83455', '55660', '82653', '13267', '32085', '50461', '60940', '51849', '48657', '55260', '82501', 
        '42843', '59813', '51405', '82556', '82656', '85598', '60848', '83409', '83390', '85607', '47556', '31938', '17998', 
        '11131', '82534', '61465', '56697', '57015', '61023', '85436', '82508', '83451', '56568', '87620', '83411', '40866', 
        '83452', '59261', '83994', '41929', '00000'
    ];

    const MainPage = () => {
        const { data: session, status } = useSession();
        const [showModal, setShowModal] = useState(false);
        const [pilotModal, setPilotModal] = useState(false);
        const [linkModal, setLinkModal] = useState(false);
        const [openModal, setOpenModal] = useState(false);
        const [loading, setLoading] = useState(false);
        const router = useRouter();
        const userId = session?.user?.id;
    
        const { data: user, error: userError } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);
        const { data: level, error: levelError, mutate } = useSWR(session ? `/api/level/user?userId=${userId}` : null, fetcher);
        const { data: coins, error: coinsError, mutate: mutateCoins } = useSWR('/api/coins/user?userId=' + session?.user?.id, fetcher);
    
        useEffect(() => {
            if (status === "loading" || !session || !user) return;
            if (userError || !user || user?.user === null) {
                router.push('/register');
                return;
            }
    
            if (manager.includes(user.user.empId)) {
                axios.get(`/api/manager/check?userId=${user.user.userId}`)
                    .then(res => {
                        if (!res.data.hasLoggedIn) {
                            axios.post('/api/points/point', {
                                userId: session.user.id,
                                description: 'point พิเศษ',
                                contentId: null,
                                type: 'earn',
                                points: 100,
                            });
    
                            axios.post('/api/manager', {
                                userId: session.user.id,
                                loginDate: new Date(),
                            });
    
                            setShowModal(true);
                        }
                    })
                    .catch(err => console.error(err));
            }
    
            if (CoinsPilot.includes(user.user.empId)) {
                axios.get(`/api/coinspilot/check?userId=${user.user.userId}`)
                .then(res => {
                    if (!res.data.hasLoggedIn) {
                        axios.post('/api/coins/coins', {
                            userId: session.user.id,
                            description: 'pilot',
                            type: 'earn',
                            coins: 50,
                        });
    
                        axios.post('/api/coinspilot', {
                            userId: session.user.id,
                            loginDate: new Date(),
                        });
    
                        setPilotModal(true);
                    }
                })
                .catch(err => console.error(err));
            }

            // Check if today is the user's birthday and set modal to open
            if (user?.user?.birthdate) {
                const today = new Date();
                const birthdate = new Date(user.user.birthdate);

                if (today.getDate() === birthdate.getDate() && today.getMonth() === birthdate.getMonth()) {
                    setOpenModal(true);
                }
            }

        }, [router, session, status, user, userError]);
    
        const onRequestClose = () => {
            setShowModal(false);
        };
    
        const onExchangeAdd = async () => {
            mutate();
            mutateCoins();
        };
    
        if (status === "loading" || !user || !level || loading ) return <Loading />;
        if (userError) return <div>Error loading data</div>;
    
        return (
            <React.Fragment>
                <RecheckUser>
                    <main className="flex flex-col bg-gray-10 justify-between items-center text-center min-h-screen">
                        <div className="flex justify-end mt-2 mr-3 w-full">
                            <MenuPanel user={user} />
                        </div>
                        <div className="w-full p-5 mt-[-10px]">
                            <UserPanel user={user} level={level} onExchangeAdd={onExchangeAdd} setLoading={setLoading} loading={loading} coins={coins}/>
                        </div>
                        <div className="flex-grow flex items-center justify-center">
                            <MainIconMenu />
                        </div>
                        <div className="flex w-full mb-10 px-5">
                            <div className="flex flex-row justify-center w-full border-4 p-4 border-[#0056FF] rounded-xl gap-2"
                                onClick={() => setLinkModal(true)}
                            >
                                <Image
                                    src="/images/Link-01.svg"
                                    width={40}
                                    height={40}
                                    alt="Link"
                                    style={{ width: '30px', height: 'auto' }}
                                />
                                <span className="text-[#0056FF] font-bold">
                                    รวม Link
                                </span>
                            </div>
                        </div>
                        <div className="w-full">
                            <Carousel />
                        </div>
                        <div className="relative w-full footer-content">
                            <FooterContant />
                            <div className="text-center text-xs text-gray-300 mb-10">
                                <p>Copyright © 2024. All Rights Reserved.</p>
                                <span className=""> Powered by <span className="text-[#0056FF]/50 font-bold">One Retail</span></span>
                                <span className="ml-2">v.1.5.0</span>
                            </div>
                        </div>
                        <ManagerModal isOpen={showModal} onRequestClose={onRequestClose} score={100} />
                        <PilotModal isOpen={pilotModal} onRequestClose={onRequestClose} score={50} />
                        <LinkModal isOpen={linkModal} onRequestClose={() => setLinkModal(false)} />
                        <BirthDayModal isOpen={openModal} onRequestClose={() => setOpenModal(false)} name={user.user.fullname} />
                    </main>
                </RecheckUser>
            </React.Fragment>
        );
    };
    
    MainPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;
    
    MainPage.auth = true;
    
    export default MainPage;
