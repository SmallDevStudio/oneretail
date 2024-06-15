import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Loading from "@/components/Loading";

const fetcher = (url) => fetch(url).then((res) => res.json());

const withAuthCheck = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    const { data: user, error: userError, isValidating: userValidating } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);
    const { data: loginData, error: loginError, isValidating: loginValidating } = useSWR(() => userId ? `/api/loginreward/${userId}` : null, fetcher);
    const { data: settingData, error: settingError, isValidating: settingValidating } = useSWR(`/api/settings`, fetcher);

    useEffect(() => {
      if (status === "loading" || userValidating || loginValidating || settingValidating) return; // ยังโหลดข้อมูลอยู่

      if (!session) {
        router.push('/auth/signin'); // ถ้า session ไม่มีหรือยังไม่ได้ login
      } else if (user && loginData && settingData) {
        if (!user) {
          router.push('/register');
        } else if (!loginData.receivedPointsToday) {
          router.push('/loginreward');
        } else if (settingData.data[0].survey) {
          router.push('/pulsesurvey');
        } else {
          // Allow the user to access the requested page
        }
      }
    }, [session, status, user, loginData, settingData, userValidating, loginValidating, settingValidating, router]);

    if (status === "loading" || userValidating || loginValidating || settingValidating) {
      return <Loading />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthCheck;
