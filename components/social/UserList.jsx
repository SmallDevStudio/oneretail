import { useState, useEffect } from "react";
import Image from "next/image";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase"; // Firebase client SDK
import Avatar from "../utils/Avatar";

export default function UserList({ users }) {
    const [userOnline, setUserOnline] = useState([]);

    useEffect(() => {
        if (!users || users.length === 0) return;

        const onlineStatusRefs = [];
        const onlineUsers = [];

        users.forEach((user) => {
            const userStatusRef = ref(database, `users/${user.user.userId}/online`);

            const unsubscribe = onValue(userStatusRef, (snapshot) => {
                if (snapshot.val() === true) {
                    // Add user to onlineUsers if online
                    if (!onlineUsers.find((u) => u.userId === user.user.userId)) {
                        onlineUsers.push(user.user);
                        setUserOnline([...onlineUsers]); // Update state
                    }
                } else {
                    // Remove user if offline
                    const index = onlineUsers.findIndex((u) => u.userId === user.user.userId);
                    if (index !== -1) {
                        onlineUsers.splice(index, 1);
                        setUserOnline([...onlineUsers]); // Update state
                    }
                }
            });

            // Track all listeners for cleanup
            onlineStatusRefs.push({ ref: userStatusRef, unsubscribe });
        });

        return () => {
            // Cleanup all listeners
            onlineStatusRefs.forEach(({ unsubscribe }) => unsubscribe());
        };
    }, [users]);

    const handleOpenChat = (user) => {
        
    };

    return (
        <div className="flex w-full">
            {userOnline.length > 0 ? (
                <div className="flex flex-row w-full gap-2 items-center overflow-x-scroll">
                    {userOnline.map((user) => (
                        <div key={user.userId} className="flex items-center space-x-4">
                            <Avatar 
                                src={user.pictureUrl}
                                size={50}
                                userId={user.userId}
                                onClick={() => handleOpenChat(user)}
                            />
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
