"use client";
import React from "react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import CheckUser from "@/lib/hook/chckUsers";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";


const HomePage = () => {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const { isRegisterd } = CheckUser();
    const userId = session?.user?.id;
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(`/api/users/${userId}`, fetcher);
    const router = useRouter();

    useEffect(() => {
        try {
            if (data == null) {
            setIsLoading(false);
             router.push('/register');
            }
            const user = data.user;
            if (user === null) {
              setIsLoading(false);
              router.push('/register');
            } else {
              setIsLoading(false);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('isRegisterd', true);
                router.push('/main');
            }
          } catch (error) {
            console.log(error);
          }
       
    }, [data, router])

    
    if (error) return <div>Failed to load</div>;
    if (!data) return <Loading />;
    if (isLoading) return <Loading />
    
    return <div>Home</div>;
}
export default HomePage