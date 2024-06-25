import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import RequireAuth from "@/components/RequireAuth";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "./GoogleAnalytics";
import "@/styles/globals.css";


function App({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();

  
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

