import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import RequireAuth from "@/components/RequireAuth";
import Image from "next/image";
import Loading from "@/components/Loading";

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
                if (data === null) {
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
        <div className="flex flex-col justify-center items-center text-center mt-10">
            <div>
                <div>
                    <h1 className="text-3xl font-bold">Welcome</h1>
                </div>
                <div className="flex mt-10">
                    <Image
                        src={session.user.image}
                        alt="one Retail Logo"
                        width={150}
                        height={150}
                        className="inline rounded-full border-3 border-[#0056FF] dark:border-white"
                        priority
                    />
                </div>

                <h1>{session.user.name}</h1>
                <button onClick={() => signOut()}>Sign out</button>
            </div>
            <div className="mt-5">
                <button 
                    className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded"
                    onClick={() => router.push("/register")}
                >register</button>
            </div>
        </div>
    );
};

Home.auth = true;

    