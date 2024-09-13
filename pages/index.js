import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const HomePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    const { data: user, error: userError, isLoading } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);
    const { data: loginReward, error: loginRewardError } = useSWR(() => userId ? `/api/loginreward/${userId}` : null, fetcher);
    const { data: survey, error: surveyError } = useSWR(() => userId ? `/api/survey/checkSurvey?userId=${userId}` : null, fetcher);
    const { data: surveySettings, error: surveySettingsError } = useSWR('/api/survey/settings', fetcher);

    useEffect(() => {
        if (status === "loading" || !user) return;
        if (status === "unauthenticated") {
            router.push("/login");
        }

        if (!session) {
            router.push('/login');
            return;
        }
        if (!user || user?.user === null) {
            router.push('/register');
            return;
        }

        if(!user.user.active){
            signOut();
            router.push('/login');
            return;
        }
        if (loginReward && !loginReward.receivedPointsToday) {
            router.push('/loginreward');
            return;
        }
        if (surveySettings && !surveySettings.isSurveyEnabled) {
            router.push('/main');
            return;
        }
        if (survey && !survey.completed) {
            router.push('/pulsesurvey');
            return;
        }

        router.push("/main");

    }, [status, router, session, user, loginReward, surveySettings, survey]);

    if (status === "loading" || isLoading || !user || !loginReward || !survey || !surveySettings ) return <Loading />;
    if (userError || loginRewardError || surveyError || surveySettingsError ) return <div>Error loading data</div>;

    return (
        <React.Fragment>
            <Loading />
        </React.Fragment>
    );
}

export default HomePage;

HomePage.auth = true;
