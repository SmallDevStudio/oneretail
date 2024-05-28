import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function useSession() {
    const [ session, setSession ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
            const oneSession = JSON.parse(localStorage.getItem("ONE_SESSION"));
            if (!oneSession) {
                setLoading(false);
                return router.push("/login");
            }
            if (oneSession.isLoggedIn === false) {
                setLoading(false);
                return router.push("/login");
            } 
            if (oneSession.isRegistered === false) {
                setLoading(false);
                return router.push("/register");
            }
            const res = await fetch("/api/session");
            if (res.ok) {
                const data = await res.json();
                setSession(data);
                setLoading(false);
            } else {
                setSession(null);
                setLoading(false);
            }
        }
        fetchSession();
    }, [router]);
   
    const deleteSession = () => {
        localStorage.removeItem("user");
        for (const key in localStorage) {
            if (key.startsWith('LIFE_STORE')) {
                localStorage.removeItem(key);
            }
        }
        setSession(null);
        router.push("/login"); // Redirect to login page
    };

    return { session, loading, deleteSession, setSession };
}