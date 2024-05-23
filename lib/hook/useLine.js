import { useEffect, useState } from "react";

export default function useLine() {
    const [ liffObject, setLiffObject ] = useState(null);
    const [ status, setStatus ] = useState('signin');
    const [ idtoken, setIdtoken ] = useState(null);
    const [ accessToken, setAccessToken ] = useState(null);
  
    const login = () => {
        liffObject?.login();
    }

    const logout = () => {
        liffObject?.logout();
        router.push('/');
    }

    useEffect(() => {
        if (status !== 'inited') {
            console.log("status:", status);

            const initLiff = async () => {
                const liff = (await import('@line/liff')).default;
                liff
                    .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
                    .then(() => {
                        console.log('liff init done.', liff);
                        setLiffObject(liff);
                        if (liff.isLoggedIn()) {
                            setStatus('registered');
                            console.log('liff login done.');

                            const idtoken = liff.getIDToken();
                            setIdtoken(idtoken);
                            console.log('idtoken:', idtoken);

                            const accessToken = liff.getAccessToken();
                            setAccessToken(accessToken);
                            console.log('accessToken:', accessToken);

                        } else {
                            liff.login();
                        }
                    })
                    .catch((error) => {
                        console.log('liff init error.', error);
                    });

            }
            initLiff();
            
        }

    }, [status]);

    const idtokens = idtoken;
    const accesstokens = accessToken;

    
    return { liffObject, status, login, logout, idtokens, accesstokens };

}

