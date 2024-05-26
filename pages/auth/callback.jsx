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
    const { data, error } = useSWR('/api/users/verify/'+ userId, fetcher);

    if (error) {
        return <div>failed to load</div>
    }

    if (!data) {
        return router.push('/auth/adduser');
    }

    if (data) {
        return router.push('/admin');
    }

    if (status === 'inited') {
        return router.push('/auth/adduser');
    } else if (status === 'registered') {
        return router.push('/');
    }


}

export async function getServerSideProps(context) {
    const { query } = context;
    const { code } = query;

    return {
        props: {
            code
        }
    }
}