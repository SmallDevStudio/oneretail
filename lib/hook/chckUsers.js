import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const CheckUser = () => {
    const { data: session, status } = useSession();
    const [isRegisterd, setIsRegisterd] = useState(false);
    const router = useRouter();

    const userId = session?.user.id;
    
    useEffect(() => {
        if (status === "authenticated") {
            if (session) {
                const fetchUser = async () => {
                    const response = await fetch(`/api/users/${userId}`);
                    const data = await response.json();
            
                    if (data) {
                        localStorage.setItem("user", JSON.stringify(data));
                        localStorage.setItem("isRegisterd", true);
                        setIsRegisterd(true);
                    } else {
                        localStorage.setItem("isRegisterd", false);
                        setIsRegisterd(false);
                        router.push("/register");
                    }
                }

                fetchUser();
            } else {
                localStorage.setItem("isRegisterd", false);
                setIsRegisterd(false);
            }

        } else {
            localStorage.setItem("isRegisterd", false);
            setIsRegisterd(false);
        }
    }, [router, session, status, userId]);

    return { isRegisterd };
  
}

export default CheckUser;