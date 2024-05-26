import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import useLine from "@/lib/hook/useLine";

const fetcher = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}
export default function Callback(props) {
    const { status } = props
    const router = useRouter();
    const { profile } = useLine();
    const { userId } = profile;
    const [ userdata , setUserData ] = useState({});
    const [ newStatus, setNewStatus ] = useState(status);
    const { data, error } = useSWR('/api/users/verify/'+ userId, fetcher);

    if (error) {
        return <div>failed to load</div>
    }

    if (!data) {
        return router.push('/auth/adduser');
    }

    if (data) {
        setUserData(data);
        setNewStatus('registered');

        props.status = newStatus;
        props.user = userdata;

        return data.role === 'admin' ? router.push('/admin') : 
        data.role === 'superadmin' ? router.push('/admin') : router.push('/main');
    }

    if (status === 'inited') {
        return router.push('/auth/adduser');
    } else if (status === 'registered') {
        return router.push('/main');
    } return router.push('/main');


}

export const getServerSideProps = async () => {
    return {
        props: {
            status: 'registered',
            user: {...userdata}
        }
    }
}
