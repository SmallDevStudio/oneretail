import Head from "next/head";
import { SessionProvider } from "next-auth/react";

import "@/styles/globals.css";

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps },
  }) {

  return (
    <>
      <Head>
        <title>One Retail</title>
        <description>One Retail Application</description>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>

      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}
