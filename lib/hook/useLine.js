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
            const liffId = process.env.NEXT_PUBLIC_LIFF_ID
            await liff.init({ liffId })
            console.log("liff", liff)
            if (!liff.isLoggedIn()) {
                setStatus('signin')
            } else {
                setStatus('inited')
                setLiffObject(liff)
            } 
        }
        liffIntialize()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [status]);

    return (
        {
            liffObject,
            status,
            login,
            logout
        })
}