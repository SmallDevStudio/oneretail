import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import useLine from "@/lib/hook/useLine";
import useSession from "@/lib/hook/useSession";

export default function Callback(props) {
    const { status } = props
    const router = useRouter();
    const { profile } = useLine();
    const { userId } = profile;
    const [ userdata , setUserData ] = useState({});
    const [ newStatus, setNewStatus ] = useState(status);

    
   

    if (status === 'inited') {
        return router.push('/auth/adduser');
    } else if (status === 'registered') {
        return router.push('/admin');
    } return router.push('/main');


}
