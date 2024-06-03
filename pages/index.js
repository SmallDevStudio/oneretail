"use client";
import React from "react";
import { useState, useEffect } from "react";

const HomePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUser(data);
        };
        fetchUser();
    }, []);

    console.log('user',user);
    




    return <div>Home</div>;
}
export default HomePage