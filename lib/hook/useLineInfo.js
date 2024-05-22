import { useState } from "react";

export default function useLineInfo({ liff, Status}) {
    const [idtoken, setIdtoken] = useState('');
    const [accesstoken, setAccesstoken] = useState('');

    if (Status !== 'inited') {
        return { idtoken: idtoken, accesstoken: accesstoken }, version; '';
    }

    liff
        ?.getAccessToken()
        .then((accessToken) => {
            setAccesstoken(accessToken);
        })
        .then(() => {
            liff
                ?.getIDToken()
                .then((idToken) => {
                    setIdtoken(idToken);
                })
                .catch((error) => {
                    console.error(error);
                });
        })
        .catch((error) => {
            console.error(error);
        });

    const version = liff.getVersion();

    return { idtoken: idtoken, accesstoken: accesstoken }, version;
}
