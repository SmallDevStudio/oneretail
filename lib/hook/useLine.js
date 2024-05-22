import { useEffect, useState } from "react";

export default function useLine() {
    const [liffObject, setLiffObject] = useState(null);
    const [Status, setStatus] = useState('signin');

    const login = () => {
        if (liffObject) {
            liffObject.login();
        }
    }
    const logout = () => {
        if (liffObject) {
            liffObject.logout();
        }
    };

    const getAccessToken = () => {
        if (liffObject) {
            return liffObject.getAccessToken();
        }
    }

    const getProfile = () => {
        if (liffObject) {
            return liffObject.getProfile();
        }
    }

    const getIDToken = () => {
        if (liffObject) {
            return liffObject.getIDToken();
        }
    }

    useEffect(() => {
        if (Status === "inited") return;
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
    }, [Status]);

    return (
        {
            liffObject,
            Status,
            login,
            logout,
            getAccessToken,
            getProfile,
            getIDToken
        })
}