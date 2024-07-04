import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import RequireAuth from "@/components/RequireAuth";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "./GoogleAnalytics";
import { useEffect } from "react";
import "@/styles/globals.css";
import AddToHomeScreenPrompt from "@/lib/hook/AddToHomeScreenPrompt";


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

  
  return getLayout(
    <SessionProvider session={session}>
        {Component.auth ? (
          <>
                <RequireAuth>
                    <GoogleAnalytics />
                      <Component {...pageProps} />
                      <SpeedInsights />
                      <Analytics />
                      <AddToHomeScreenPrompt />
 
                </RequireAuth>
                </>
            ) : (
                <>
                <GoogleAnalytics />
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

