// pages/checkSurvey.js
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Loading from "@/components/Loading";

const fetcher = (url) => fetch(url).then((res) => res.json());

const CheckSurvey = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    const { data: survey, error: surveyError } = useSWR(() => userId ? `/api/survey/checkSurvey?userId=${userId}` : null, fetcher);
    const { data: surveySettings, error: surveySettingsError } = useSWR('/api/survey/settings', fetcher);

    useEffect(() => {
        if (!session) {
            router.push('/login');
            return;
        }
        if ((!survey && !surveyError) || (!surveySettings && !surveySettingsError)) return; // Still loading
        if (surveySettingsError || surveyError) {
            console.error("Error loading survey or settings data", surveySettingsError || surveyError);
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
    }, [session, survey, surveySettings, surveyError, surveySettingsError, router]);

    if ((!survey && !surveyError) || (!surveySettings && !surveySettingsError)) return <Loading />;
    if (surveyError || surveySettingsError) return <div>Error loading data</div>;

    return <Loading />;
};

export default CheckSurvey;

CheckSurvey.auth = true;
