import { useState } from "react";

export default function useLineInfo({ liff, status}) {
    const [idtoken, setIdtoken] = useState('');
    const [accesstoken, setAccesstoken] = useState('');
    const [profile, setProfile] = useState(null);

    if (status !== 'inited') 
        return {idtoken, accesstoken, profile: {}, version: ''}

    liff
        ?.getProfile()
        .then((profile) => {
            setProfile({
                ...profile,
            });

            console.log(profile);
        })
        .catch((error) => {
            console.log(error);
        });

    liff
        ?.getIdToken()
        .then((idtoken) => {
            setIdtoken(idtoken);

            console.log(idtoken);
        })
        .catch((error) => {
            console.log(error);
        });
        

    liff
        ?.getAccessToken()
        .then((accesstoken) => {
            setAccesstoken(accesstoken);

            console.log(accesstoken);
        })
        .catch((error) => {
            console.log(error);
        });

    const version = liff?.getVersion();

    return {idtoken: idtoken,accesstoken: accesstoken, profile: profile, version};
   
}
