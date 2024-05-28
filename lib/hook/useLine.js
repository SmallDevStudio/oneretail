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
            setLiffObject(Liff);
            if (Liff.isLoggedIn()) {
                const profile = await Liff.getProfile();
                setProfile(profile);
            }
        } catch (error) {
            console.log('liff init error:', error);
        }
    }

    useEffect(() => {
        initLiff();
    }, []);
    
    return { liffObject, login, logout, profile };
}