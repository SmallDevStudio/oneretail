import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

export default function RequireAuth({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
        if (status === "unauthenticated") {
            router.push("/login"); // Redirect to login if not authenticated   
        } else {
        }
         // Redirect to login if not authenticated
    }, [session, status, router]);

    if (status === "loading") {
        return <Loading />; // Show a loading state while checking auth status
    }

    if (!session) {
        return null; // Render nothing if unauthenticated (will redirect)
    }

    return children;
}