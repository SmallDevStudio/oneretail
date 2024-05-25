import { useEffect, useState } from "react";

export default function useLine() {
    const [ liffObject, setLiffObject ] = useState(null);
    const [ status, setStatus ] = useState('signin');
    const [ idtoken, setIdtoken ] = useState(null);
    const [ accessToken, setAccessToken ] = useState(null);
    const [ userId, setUserId ] = useState(null);
    const [ pictuerUrl, setPictuerUrl ] = useState(null);
  
    const login = () => {
        liffObject?.login();
    }

    const logout = () => {
        liffObject?.logout();
        router.push('/');
    }

    useEffect(() => {
        if (status !== 'inited') {
            const initLiff = async () => {
                const liff = (await import('@line/liff')).default;
                liff
                    .init({ liffId: process.env.LINE_LIFF_ID })
                    .then(() => {
                        setLiffObject(liff);
                        if (liff.isLoggedIn()) {
                            setStatus('inited');
                            console.log('liff login done.');

                            const idtoken = liff.getIDToken();
                            setIdtoken(idtoken);

                            const accessToken = liff.getAccessToken();
                            setAccessToken(accessToken);

                            liff.getProfile().then((profile) => {
                                setUserId(profile.userId);
                                setPictuerUrl(profile.pictureUrl);
                            });

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
    const profile = { userId, pictuerUrl };
    
    return { liffObject, status, login, logout, idtokens, accesstokens, profile };

}

