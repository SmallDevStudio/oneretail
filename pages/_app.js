import { SessionProvider, getSession } from "next-auth/react";
import RequireAuth from "@/components/RequireAuth";
import "@/styles/globals.css";

function App({ Component, pageProps: { session, ...pageProps } }) {
  
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(

    <SessionProvider session={session}>

        {Component.auth ? (
                <RequireAuth>
                    <Component {...pageProps} />
                </RequireAuth>
            ) : (
                <Component {...pageProps} />
            )}

    </SessionProvider>

  )
}

export default App;

