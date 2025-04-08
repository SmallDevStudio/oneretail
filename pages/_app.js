import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import RequireAuth from "@/components/RequireAuth";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import "@/styles/globals.css";
import { initGA, logPageView } from "@/utils/analytics";
import Head from "next/head";
import "@/styles/editor.scss";
import useUserActivity from "@/lib/hook/useUserActivity";
import useNetworkStatus from "@/lib/hook/useNetworkStatus";
import { AppLayout } from "@/themes";
import { AdminLayout } from "@/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  trackClick,
  trackScrollOnce,
  trackPageTime,
} from "@/utils/privacypolicy";
import dynamic from "next/dynamic";

const CookieConsent = dynamic(() => import("@/lib/CookieConsent"), {
  ssr: false,
});

function App({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();
  const isAdminRouter = router.pathname.startsWith("/admin");
  const isAds = router.pathname.startsWith("/ads");
  const isPulseSurvey = router.pathname.startsWith("/pulsesurvey");
  const isLogin = router.pathname.startsWith("/login");
  const isRegister = router.pathname.startsWith("/register");
  const isMessagerId = router.pathname.startsWith("/messager/");
  const isShare = router.pathname.startsWith("/share/");

  useEffect(() => {
    initGA(process.env.NEXT_PUBLIC_GOOGLE_ID);

    const handleRouteChange = (url) => {
      logPageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const handleClick = (e) => trackClick(e.target.outerHTML);
    document.addEventListener("click", handleClick);
    trackPageTime();
    trackScrollOnce();
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (
    isAds ||
    isPulseSurvey ||
    isLogin ||
    isRegister ||
    isMessagerId ||
    isShare
  ) {
    return (
      <SessionProvider session={session}>
        <UserActivityWrapper>
          <Head>
            <title>One Retail</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <Component {...pageProps} />
          <CookieConsent />
          <ToastContainer position="top-right" autoClose={3000} />
          <SpeedInsights />
          <Analytics />
        </UserActivityWrapper>
      </SessionProvider>
    );
  }

  const Layout = isAdminRouter ? AdminLayout : AppLayout;

  return (
    <SessionProvider session={session}>
      <UserActivityWrapper>
        <Layout>
          <Head>
            <title>One Retail</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <Component {...pageProps} />
          <CookieConsent />
          <ToastContainer position="top-right" autoClose={3000} />
          <SpeedInsights />
          <Analytics />
        </Layout>
      </UserActivityWrapper>
    </SessionProvider>
  );
}

function UserActivityWrapper({ children }) {
  useUserActivity(); // ใช้ custom hook เพื่อบันทึก user activity
  useNetworkStatus(); // เรียกใช้ useNetworkStatus หลัง SessionProvider
  return <>{children}</>;
}

export default App;
