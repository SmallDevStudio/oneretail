import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RequireAuth({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
        if (status === "unauthenticated") router.push("/login"); // Redirect to login if not authenticated
    }, [session, status, router]);

    if (status === "loading") {
        return <div>Loading...</div>; // Show a loading state while checking auth status
    }

    if (!session) {
        return null; // Render nothing if unauthenticated (will redirect)
    }

    return children;
}