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

  const {
    data: user,
    error: userError,
    isLoading,
  } = useSWR(() => (userId ? `/api/users/${userId}` : null), fetcher);
  const {
    data: survey,
    error: surveyError,
    isLoading: isLoadingSurvey,
  } = useSWR(`/api/survey/checkSurvey?userId=${userId}`, fetcher);
  const { data: ads, error: adsError } = useSWR("/api/ads/page", fetcher);

  useEffect(() => {
    if (status === "loading" || !user || !survey || !ads) return;

    if (!user || user?.user === null) {
      router.push("/register");
      return;
    }

    if (!user.user.active) {
      signOut();
      return; // middleware จะจัดการพาไป login เอง
    }

    if (survey && !survey.completed) {
      router.push("/pulsesurvey");
      return;
    }

    if (ads && ads.data.length > 0) {
      router.push("/ads");
      return;
    }

    router.push("/main");
  }, [status, router, session, user, survey, ads]);

  if (
    status === "loading" ||
    isLoading ||
    !user ||
    !survey ||
    !ads ||
    isLoadingSurvey
  )
    return <Loading />;
  if (userError || surveyError || adsError)
    return <div>Error loading data</div>;

  return (
    <React.Fragment>
      <Loading />
    </React.Fragment>
  );
};

export default HomePage;
