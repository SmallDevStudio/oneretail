import React, { useState, useEffect } from "react";
import Image from "next/image";

const AvatarUsers = ({ userId }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [userId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>Error loading user data</div>;
    }

    return (
        <div className="flex items-center avatar">
            <Image
                src={userData?.avatar}
                alt={userData?.name}
                width={50}
                height={50}
                className="rounded-full"
            />
        </div>
    );
}

export default AvatarUsers;