import React, { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
        if (status === "unauthenticated") router.push("/login"); // Redirect to login if not authenticated
        if (status === "authenticated") {
            axios
                .get("/api/user/"+session.user.id)
                .then((res) => {
                    setUser(res.data);
                    localStorage.setItem("user", JSON.stringify(res.data));
                   
                })
                .catch((err) => {
                    setError(err);
                    router.push("/register");
                });
        }
    }, [session, status, router]);

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                error,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
    