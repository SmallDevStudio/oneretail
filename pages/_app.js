import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import RequireAuth from "@/components/RequireAuth";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "./GoogleAnalytics";
import { useEffect } from "react";
import "@/styles/globals.css";
import useAddToHomeScreen from "@/lib/hook/useAddToHomeScreen";


function App({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();

  useAddToHomeScreen();

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

  
  return getLayout(
    <SessionProvider session={session}>
        {Component.auth ? (
          <>
                <RequireAuth>
                    <GoogleAnalytics />
                      <Component {...pageProps} />
                      <SpeedInsights />
                      <Analytics />
 
                </RequireAuth>
                </>
            ) : (
                <>
                <GoogleAnalytics />
                <Component {...pageProps} />
                <SpeedInsights />
                <Analytics />
                </>
            )}
    </SessionProvider>
  );
}


export default App;

