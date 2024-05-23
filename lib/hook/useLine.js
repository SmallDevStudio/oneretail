import liff from "@line/liff";
import { useEffect, useState } from "react";

export default function useLine() {
    const [ liffObject, setLiffObject ] = useState(null);
    const [ status, setStatus ] = useState(null);

    const login = () => {
        liffObject?.login();
    }

    const logout = () => {
        liffObject?.logout();
        removeLocalStorage('status');
        router.push('/login');
    }

    useEffect(() => {
        
        if (status === 'inited') {
            const init = async () => {
                await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
                .then(() => {
                    setLiffObject(liff);
                    console.log('liff init done.', liff);
                    if (liff.isLoggedIn()) {
                        setStatus('inited');
                        console.log('liff login done.');
                    }
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

    return { liffObject, status, login, logout };

}

