import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import Head from "next/head";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const HomePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    const { data: user, error: userError } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);
    const { data: loginReward, error: loginRewardError } = useSWR(() => userId ? `/api/loginreward/${userId}` : null, fetcher);
    const { data: survey, error: surveyError } = useSWR(() => userId ? `/api/survey/checkSurvey?userId=${userId}` : null, fetcher);
    const { data: surveySettings, error: surveySettingsError } = useSWR('/api/survey/settings', fetcher);

    useEffect(() => {
        if (status === "loading" || !session || !user || !loginReward || !survey || !surveySettings) return;
        if (userError || loginRewardError || surveyError || surveySettingsError) return;

        if (!session) {
            router.push('/login');
            return;
        }
        if (!user || user?.user === null) {
            router.push('/register');
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
        if (survey && survey.completed) {
            router.push('/main');
        } else {
            router.push('/pulsesurvey');
        }
    }, [router, session, status, user, loginReward, survey, surveySettings, userError, loginRewardError, surveyError, surveySettingsError]);

    if (status === "loading" || !user || !loginReward || !survey || !surveySettings) return <Loading />;
    if (userError || loginRewardError || surveyError || surveySettingsError) return <div>Error loading data</div>;

    return (
        <React.Fragment>
            <Loading />
        </React.Fragment>
    );
}

export default HomePage;

HomePage.auth = true;
