import React, { useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import RequireAuth from "@/components/RequireAuth";
import Image from "next/image";


export default function Home() {
    const { data: session } = useSession();
    const router = useRouter();

    if (!session) {
        return (
            <div className="text-3xl font-bold underline">
                <Link href="/login">Please sign in </Link>
            </div>
        );
    }
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

    