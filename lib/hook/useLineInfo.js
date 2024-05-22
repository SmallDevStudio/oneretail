import { useState } from "react";
import { status } from "./useLine";

export default function useLineInfo({ liff, status }) {
    const [ userId, setUserId ] = useState('');
    const [ displayName, setDisplayName ] = useState('');
    const [ pictureUrl, setPictureUrl ] = useState('');
    const [ statusMessage, setStatusMessage ] = useState('');
    
    console.log("useLineInfo", liff, status);

    if (status !== 'inited') 
        return {profile: {
            userId: '',
            displayName: '',
            pictureUrl: '',
            statusMessage: '',
        }, version: ''}

    liff
        ?.getProfile()
        .then((profile) => {
            setUserId(profile.userId);
            setDisplayName(profile.displayName);
            setPictureUrl(profile.pictureUrl);
            setStatusMessage(profile.statusMessage);

            console.log("getProfile done", profile);
        })
        .catch((error) => {
            console.log(error);
        });

   
    const version = liff?.getVersion();

    return {
        profile: {userId, displayName, pictureUrl, statusMessage}, 
        version
    };
   
}
