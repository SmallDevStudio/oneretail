import React, { useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import RequireAuth from "@/components/RequireAuth";


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
        <div>
            <h1>{session.user.name}</h1>
            <button onClick={() => signOut()}>Sign out</button>
        </div>
    );
};

Home.auth = true;

    