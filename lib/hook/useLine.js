import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function useLine() {
    const [liffObject, setLiffObject] = useState(null);
    const [status, setStatus] = useState('signin');

    const login = () => {
        if (liffObject) {
            liffObject.login();
        }
    }
    const logout = () => {
        if (liffObject) {
            setStatus('signin');
            liffObject.logout();
        }
    };

    useEffect(() => {
        if (status === "inited") return;
        const initializeLiff = async () => {
            const liff = (await import('@line/liff')).default;
            console.log("start liff.init()...");

            liff
                .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
                .then(() => {
                    console.log("liff.init() done");
                    setLiffObject(liff);
                    if (liff.isLoggedIn()) {
                        setStatus("inited");
                        const accessToken = liff.getAccessToken();
                        console.log('accessToken:'+ accessToken);
                        const idToken = liff.getIDToken();
                        console.log('idToken:'+ idToken);
                    } else {
                        setStatus("signin");
                        liff.login();
                    }
                })
                .catch((error) => {
                    console.log(`liff.init() failed: ${error}`);
                    if (!process.env.NEXT_PUBLIC_LIFF_ID) {
                        console.info(
                            "LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable."
                        );
                    }
                });
            
        };
        initializeLiff();
    }, [status]);

    return (
        {
            liffObject,
            status,
            login,
            logout
           
        })
}