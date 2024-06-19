//home
"use client";
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

    // Function to handle redirection
    const handleRedirection = (user, loginReward, survey, surveySettings) => {
        if (!session) {
            router.push('/login');
            return;
        }
        if (!user) {
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
    };

    // SWR hooks to fetch data
    const { data: user, error: userError } = useSWR(() => userId ? `/api/users/${userId}` : null, fetcher);
    const { data: loginReward, error: loginRewardError } = useSWR(() => userId ? `/api/loginreward/${userId}` : null, fetcher);
    const { data: survey, error: surveyError } = useSWR(() => userId ? `/api/survey/checkSurvey?userId=${userId}` : null, fetcher);
    const { data: surveySettings, error: surveySettingsError } = useSWR('/api/survey/settings', fetcher);

    useEffect(() => {
        // Check if any data is loading
        const isLoading = status === "loading" || !user || !loginReward || !survey || !surveySettings;

        if (isLoading) return;
        if (userError || loginRewardError || surveyError || surveySettingsError) {
            console.error("Error loading data", userError || loginRewardError || surveyError || surveySettingsError);
            return;
        }
        
        handleRedirection(user, loginReward, survey, surveySettings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, status, user, loginReward, survey, surveySettings, userError, loginRewardError, surveyError, surveySettingsError, router]);

    if (status === "loading" || !user || !loginReward || !survey || !surveySettings) return <Loading />;
    if (userError || loginRewardError || surveyError || surveySettingsError) return <div>Error loading data</div>;

    return (
        <React.Fragment>
            <Head>
                <title>One Retail</title>
                <link rel="apple-touch-icon" sizes="180x180" href="dist/icons/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="dist/icons/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="dist/icons/favicon-16x16.png"/>
                <link rel="manifest" href="/manifest.json"></link>
            </Head>
            <Loading />
        </React.Fragment>
    );
}

export default HomePage;

HomePage.auth = true;
