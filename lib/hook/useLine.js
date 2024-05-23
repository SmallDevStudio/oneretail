import { useEffect, useState } from "react";

export default function useLine() {
    const [ liffObject, setLiffObject ] = useState(null);
    const [ status, setStatus ] = useState('signin');
    const [ profile, setProfile ] = useState(null);
    const [ idtoken, setIdtoken ] = useState(null);
    const [ accessToken, setAccessToken ] = useState(null);

    const login = () => {
        liffObject?.login();
    }

    const logout = () => {
        liffObject?.logout();
        router.push('/login');
    }

    useEffect(() => {
        if (status !== 'inited') {
            console.log(status);
            const init = async () => {
                await liff.init({ liffId: process.env.LINE_LIFF_ID })
                .then(() => {
                    setLiffObject(liff);
                    console.log('liff init done.', liff);
                    if (liff.isLoggedIn()) {
                        setStatus('inited');
                        console.log('liff login done.');
                        const profile = liff.getProfile();
                        setProfile(profile);
                        const idtoken = liff.getIDToken();
                        setIdtoken(idtoken);
                        const accessToken = liff.getAccessToken();
                        setAccessToken(accessToken);
                        console.log('profile:', profile);
                        console.log('idtoken:', idtoken);
                        console.log('accessToken:', accessToken);
                    }else{
                        liff.login();
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

    const idtokens = idtoken;
    const accesstokens = accessToken;
    const profiles = profile;
    
    return { liffObject, status, login, logout, idtokens, accesstokens, profiles };

}

