import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import RequireAuth from "@/components/RequireAuth";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import "@/styles/globals.css";
import { initGA, logPageView } from "@/utils/analytics";
import Head from "next/head";
import '@/styles/editor.scss';
import useUserActivity from "@/lib/hook/useUserActivity";

function App({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();

  useEffect(() => {
    initGA(process.env.NEXT_PUBLIC_GOOGLE_ID); // แทนที่ด้วยรหัสติดตาม Google Analytics ของคุณ

    const handleRouteChange = (url) => {
        logPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
    };
}, [router.events]);


  return getLayout(
    <SessionProvider session={session}>
      <UserActivityWrapper>
        {Component.auth ? (
          <>
                <RequireAuth>
                      <Head>
                        <title>One Retail</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      </Head>
                      <Component {...pageProps} />
                      <SpeedInsights />
                      <Analytics />
 
                </RequireAuth>
                </>
            ) : (
                <>
                <Head>
                  <title>One Retail</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
                <Component {...pageProps} />
                <SpeedInsights />
                <Analytics />
                </>
            )}
          </UserActivityWrapper>
    </SessionProvider>
  );
}

function UserActivityWrapper({ children }) {
  useUserActivity(); // ใช้ custom hook เพื่อบันทึก user activity
  return <>{children}</>;
}


export default App;

