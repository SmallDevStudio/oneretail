import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Loading from "@/components/Loading";
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated"){
            setLoading(false);
            router.push("/login");
        } else if (status === "authenticated") {
            const userId = session.user.id;
            const fetchUser = async () => {
                const res = await fetch(`/api/users/get/${userId}`);
                const data = await res.json();
                if (data.length === 0 && data === null) {
                    setLoading(false);
                    return router.push("/register");
                }
                localStorage.setItem("user", JSON.stringify(data));
                setUser(data);
                setLoading(false);
                return router.push("/main");
            };
            fetchUser();
        }
    }, [router, session.user.id, status]);

    if (!session) return router.push("/login");
    if (!user) return <Loading />;
    if (loading) return <Loading />;
    
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <div className='text-center justify-center items-center'>
                <div className='flex mb-10'>
                    <Image src="/dist/img/logo-one-retail.png" alt="one Retail Logo" width={150} height={150} priority/>
                </div>
                <CircularProgress />
            </div>
        </div>
    )
}

Home.auth = true;

    