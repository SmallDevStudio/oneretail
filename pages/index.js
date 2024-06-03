"use client";
import React from "react";
import { useState, useEffect } from "react";
import useSWR from "swr";

const HomePage = () => {
    const [user, setUser] = useState(null);

    const fetcher = (url) => fetch(url).then((res) => res.json());

    const { data, error } = useSWR("/api/users", fetcher);

    console.log('user',data);
    




    return <div>Home</div>;
}
export default HomePage