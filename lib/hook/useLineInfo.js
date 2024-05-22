import { useState } from "react";

export default function useLineInfo({ liff, status}) {
    const [idtoken, setIdtoken] = useState('');
    const [accesstoken, setAccesstoken] = useState('');
    const [profile, setProfile] = useState({});

    if (status !== 'inited') {
        return {
            idtoken: '',
            accesstoken: '',
            profile: {},
            version: ''
        }
    }

    liff
        ?.getAccessToken()
        .then((accessToken) => {
            setAccesstoken(accessToken);
        })
        .catch((error) => {
            console.error(error);
        });

    liff
        ?.getIdToken()
        .then((idToken) => {
            setIdtoken(idToken);
        })
        .catch((error) => {
            console.error(error);
        });

    liff
        ?.getProfile()
        .then((profile) => {
            setProfile(profile);
        })
        .catch((error) => {
            console.error(error);
        });

    const version = liff.getVersion();

    return { idtoken: idtoken, accesstoken: accesstoken, profile: profile }, version;
}
