import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

const useUserActivity = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user) {
            const handleRouteChange = async (url) => {
                try {
                    await axios.post('/api/user-activity', {
                        userId: session.user.id,
                        page: url,
                        action: 'view',
                    });
                } catch (error) {
                    console.error('Failed to record user activity', error);
                }
            };

            // บันทึกเมื่อโหลดหน้าแรกเท่านั้น
            if (router.asPath === window.location.pathname + window.location.search + window.location.hash) {
                handleRouteChange(router.asPath);
            }

            // ติดตามการเปลี่ยนแปลงหน้า
            router.events.on('routeChangeComplete', handleRouteChange);

            // Cleanup function to remove the event listener
            return () => {
                router.events.off('routeChangeComplete', handleRouteChange);
            };
        }
    }, [router.asPath, router.events, session?.user]);
};

export default useUserActivity;
