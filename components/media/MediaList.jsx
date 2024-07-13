import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const MediaList = () => {
    const [media, setMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { data, error } = useSWR('/api/medias', fetcher, {
        onSuccess: (data) => {
            setMedia(data);
        },
    });

}

export default MediaList;