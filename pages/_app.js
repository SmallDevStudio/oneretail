import { SessionProvider, getSession } from "next-auth/react";
import RequireAuth from "@/components/RequireAuth";
import { UserContext } from "@/lib/context/UserContext";
import "@/styles/globals.css";

function App({ Component, pageProps: { session, ...pageProps } }) {
  
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(

    <SessionProvider session={session}>

        {Component.auth ? (
                <RequireAuth>
                  <UserContext.Provider value={pageProps.user}>
                    <Component {...pageProps} />
                  </UserContext.Provider>
                </RequireAuth>
            ) : (
                  <Component {...pageProps} />
            )}

    </SessionProvider>

  )
}

export default App;

