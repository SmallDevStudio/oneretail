import { useEffect, useState } from "react";

export default function useLine() {
    const [ liffObject, setLiffObject ] = useState(null);
    const [ profile, setProfile ] = useState(null);
    
    const login = () => {
        liffObject?.login();
    }

    const logout = () => {
        liffObject?.logout();
        router.push('/');
    }

    const initLiff = async () => {
        try {
            const Liff = (await import('@line/liff')).default;
            await Liff.init({ liffId: process.env.LINE_LIFF_ID });
            console.log({ message: 'LIFF initialized' });
            setLiffObject(Liff);
            if (Liff.isLoggedIn()) {
                console.log({ message: 'LIFF logged in' });
                const profileData = await Liff.getProfile();
                setProfile(profileData);
            }
        } catch (error) {
            console.log('liff init error:', error);
        }
    }

    useEffect(() => {
        initLiff();
    }, []);
    
    return { liffObject, login, logout, profile, initLiff };
}