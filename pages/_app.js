"use client";
import Head from "next/head";
import { useState, useEffect } from "react";
import liff from "@line/liff";

import "@/styles/globals.css";

export default function App({ Component, pageProps}) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    console.log("start liff.init()...");
    liff
      .init({ liffId: process.env.LIFF_ID })
      .then(() => {
        console.log("liff.init() done");
        setLiffObject(liff);
      })
      .catch((error) => {
        console.log(`liff.init() failed: ${error}`);
        if (!process.env.liffId) {
          console.info(
            "LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable."
          );
        }
        setLiffError(error.toString());
      });
  }, []);

  pageProps.liff = liffObject;
  pageProps.liffError = liffError;

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
