import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import RequireAuth from "@/components/RequireAuth";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import "@/styles/globals.css";
import AddToHomeScreenPrompt from "@/lib/hook/AddToHomeScreenPrompt";
import { initGA, logPageView } from "@/utils/analytics";
import Head from "next/head";


function App({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

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
                      <AddToHomeScreenPrompt />
 
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
                <AddToHomeScreenPrompt />
                </>
            )}
    </SessionProvider>
  );
}


export default App;

