import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import RockPaperScissors from "@/components/games/RockPaperScissors";
import Loading from "@/components/Loading";

const RockPaperScissorsPage = () => {
    const [user, setUser] = useState(null);
    const { data: session, status } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    useEffect(() => {
            if (status === "loading") return;
            if (!session) return;
        
            const userId = session?.user?.id;
            // ใช้ userId ได้อย่างปลอดภัยหลังจาก session โหลดเสร็จ
        }, [status, session]);

    useEffect(() => {
        if (userId) {
            const fetchUser = async () => {
                try {
                    const response = await axios.get(`/api/users/${userId}`);
                    setUser(response.data.user);
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            }

            fetchUser();
        }
    }, [userId]);

    return (
        <>
            <RockPaperScissors 
                userId={userId}
                user={user}
            />
        </>
    );
}

export default RockPaperScissorsPage;
