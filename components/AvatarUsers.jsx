import React, { useState, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const AvatarUsers = ({ userId }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { data, error } = useSWR(`/api/users/get/${userId}`, fetcher, {
        onSuccess: (data) => {
            setUserData(data);
            setIsLoading(false);
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>Error loading user data</div>;
    }

    console.log(data);

    return (
        <div className="flex items-center avatar">
            <Image
                src={data.pictureUrl}
                alt={data.name}
                width={50}
                height={50}
                className="rounded-full"
            />
        </div>
    );
}

export default AvatarUsers;