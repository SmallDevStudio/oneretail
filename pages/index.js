"use client";
import React from "react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";

const HomePage = () => {
    const { data: session, status } = useSession();

    const userId = session?.user?.id;
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(`/api/users/${userId}`, fetcher);

    console.log('user',data);
    




    return <div>Home</div>;
}
export default HomePage