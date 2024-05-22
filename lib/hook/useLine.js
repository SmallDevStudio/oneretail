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
        if (status === "inited") return;
        import('@line/liff').then((liff) => {
            liff
                .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
                console.log("init done", liff)
                .then(() => {
                    setLiffObject(liff);
                    if (liff.isLoggedIn()) setStatus('inited');
                    console.log("liff init done", liff);
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        }, [status]);

    return (
        {
            liffObject,
            status,
            login,
            logout
        })
}