// components/RecheckUser.js
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Loading from "@/components/Loading";

const fetcher = (url) => fetch(url).then((res) => res.json());

const RecheckUser = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    const { data: user, error: userError } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);

    useEffect(() => {
        if (status === "loading" || !session) return;
        if (!user && !userError) return; // Still loading
        if (userError || !user) {
            router.push('/register');
        }
    }, [session, status, user, userError, router]);

    if (status === "loading" || (!user && !userError)) return <Loading />;
    if (userError) return <div>Error loading user data</div>;

    return children;
};

export default RecheckUser;
