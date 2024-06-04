import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const withAuthCheck = (WrappedComponent) => {
    // eslint-disable-next-line react/display-name
    return (props) => {
        const { data: session, status } = useSession();
        const router = useRouter();
        const userId = session?.user?.id;

        const { data, error } = useSWR(() => (userId ? `/api/users/${userId}` : null), fetcher);

        useEffect(() => {
            if (status === "loading") return;

            const checkUserRegistration = () => {
                const isRegistered = localStorage.getItem('isRegistered');
                if (isRegistered === 'true') {
                    // Do nothing, let the user access the page
                } else {
                    router.push('/register');
                }
            };

            if (session && !error) {
                checkUserRegistration();
            }
        }, [session, data, error, status, router]);

        if (status === "loading" || !data) {
            return <div>Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuthCheck;