import { useEffect, useState } from "react";
import liff from "@line/liff";

export const useLine = () => {
    const [liffObject, setLiffObject] = useState(null);
    const [status, setStatus] = useState('signin');

    const login = () => {
        liffObject?.login({})
    }

    const logout = () => {
        liffObject?.logout();
    }

    useEffect(() => {
        if (status === 'inited') return;
            console.log("start liff.init()...");
            liff
                .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
                .then(() => {
                    console.log("liff.init() done");
                    setLiffObject(liff);
                    if (liff.isLoggedIn()) {
                        setStatus('inited');
                        console.log("liff.isLoggedIn() done");
                    }else{
                        liff.login();
                    }
                })
                .catch((error) => {
                    console.log(`liff.init() failed: ${error}`);
                    if (!process.env.liffId) {
                        console.info(
                            "LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable."
                        );
                    }
                })
    }, [])

    return {
        liffObject,
        status,
        login,
        logout,
    }
}