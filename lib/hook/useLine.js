import liff from "@line/liff";
import { useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@/lib/localStorage";
import { useRouter } from "next/router";

export default function useLine() {
    const [ liffObject, setLiffObject ] = useState(null);
    const router = useRouter();

    const login = () => {
        liffObject?.login();
    }

    const logout = () => {
        liffObject?.logout();
        removeLocalStorage('status');
        router.push('/login');
    }

    useEffect(() => {
        const sessionStatus = getLocalStorage('status');

        if (sessionStatus === null) {
            const init = async () => {
                await liff.init({ liffId: process.env.NEXT_PUBLIC_LINE_LIFF_ID })
                .then(() => {
                    setLiffObject(liff);
                    console.log('liff init done.', liff);
                    if (liff.isLoggedIn()) setLocalStorage('status', 'login');
                    console.log('liff is logged in.');
                })
                .catch((error) => {
                    console.log('liff init error', error);
                });
            }
            init();

        } else {
            console.log('liff init skipped.');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { liffObject, login, logout };

}

