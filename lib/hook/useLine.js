import liff from "@line/liff";
import { useEffect, useState } from "react";

export default function useLine() {
    const [liffObject, setLiffObject] = useState(null);
    const [status, setStatus] = useState('signin');
    const [profileData, setProfileData] = useState({});
    const [accessTokenData, setAccessTokenData] = useState(null);

    const login = () => {
        if (liffObject) {
            liffObject?.login();
        }
    }
    const logout = () => {
        if (liffObject) {
            setStatus('signin');
            liffObject?.logout();
        }
    };

    useEffect(() => {
        if (status === 'inited') return

        const liffIntialize = async () => {
            (await import("@line/liff")).default
                .init({
                    liffId: process.env.NEXT_PUBLIC_LIFF_ID
                })
                .then(() => {
                    setLiffObject(liff);
                    console.log("liff init done.");
                    if (liff.isLoggedIn()) {
                        setStatus('inited');
                        console.log("liff login done.");

                        liff.getProfile().then((profile) => {
                            setProfileData({ ...profile });
                            console.log("liff getProfile done.", profile);
                        })
                        liff.getAccessToken().then((accessToken) => {
                            setAccessTokenData(accessToken);
                            console.log("liff getAccessToken done.", accessToken);
                        })
                    }
                })
                .catch(console.error);
        };
        liffIntialize();
      }, [status]);

      const profile = {
        userId: profileData.userId,
        displayName: profileData.displayName,
        pictureUrl: profileData.pictureUrl,
        statusMessage: profileData.statusMessage,
        accessToken: accessTokenData
      }

      const accessToken = accessTokenData;

    return (
        {
            liffObject,
            status,
            login,
            logout,
            profile,
            accessToken,
        })
}