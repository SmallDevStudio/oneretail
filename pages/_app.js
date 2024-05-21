import Head from "next/head";
import { useLine } from "@/lib/hook/useLine";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const { liffObject, status } = useLine();

  pageProps.liffObject = liffObject;
  pageProps.status = status;

  return (
    <>
      <Head>
        <title>One Retail</title>
        <description>One Retail Application</description>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
