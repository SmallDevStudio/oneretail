import { useRouter } from "next/router";
export default function Callback(props) {
    const { status } = props
    const router = useRouter();

    if (status === 'inited') {
        return router.push('/auth/adduser');
    } else if (status === 'registered') {
        return router.push('/');
    }
}