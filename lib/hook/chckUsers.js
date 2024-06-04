import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const CheckUser = () => {
    const { data: session } = useSession();
    const [isRegistered, setIsRegistered] = useState(false);
    const userId = session?.user?.id;
    const { data, error } = useSWR(() => (userId ? `/api/users/${userId}` : null), fetcher);

    useEffect(() => {
        const checkUser = () => {
            if (!data) {
                setIsRegistered(false);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('isRegistered', 'false');
                }
            } else {
                const user = data?.user;
                if (!user) {
                    setIsRegistered(false);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('isRegistered', 'false');
                    }
                } else {
                    setIsRegistered(true);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('user', JSON.stringify(user));
                        localStorage.setItem('isRegistered', 'true');
                    }
                }
            }
        };
        checkUser();
    }, [data]);

    return { isRegistered, setIsRegistered };
}

export default CheckUser;