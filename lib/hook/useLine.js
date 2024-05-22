import liff from "@line/liff";
import { useEffect, useState } from "react";

export default function useLine() {
    const [liffObject, setLiffObject] = useState(null);
    const [status, setStatus] = useState('signin');

    const login = () => {
        if (liffObject) {
            liffObject?.login();
        }
    }
    const logout = () => {
        if (liffObject) {
            setStatus('signin');
            liffObject?.logout();
        }
    };

    useEffect(() => {
        if (status === 'inited') return

        const liffIntialize = async () => {
            await liff.init({ liffId: process.env.NEXT_PUBLIC_LINE_LIFF_ID });
            setLiffObject(liff);
            console.log("liff init done", liff);
            // Check if the user is logged in
            if (liff.isLoggedIn()) {
                setStatus('inited');
                console.log("login done");
            }
            
        };
        liffIntialize();
      }, [status]);

    return (
        {
            liffObject,
            status,
            login,
            logout
        })
}