import { SessionProvider } from "next-auth/react";
import RequireAuth from "@/components/RequireAuth";
import { Provider } from "react-redux";
import store from "@/lib/redux/store";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react"
import "@/styles/globals.css";

function App({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <SessionProvider session={session}>
        {Component.auth ? (
                <RequireAuth>
                   
                      <Component {...pageProps} />
                      <SpeedInsights />
                      <Analytics />
 
                </RequireAuth>
            ) : (
                    <>
                      <Component {...pageProps} />
                      <SpeedInsights />
                      <Analytics />
                    </>
            )}
    </SessionProvider>
  );
}


export default App;

