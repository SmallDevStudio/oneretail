"use client";
import useLine from "@/lib/hook/useLine";

import "@/styles/globals.css";

export default function App({ Component, pageProps}) {
  const { liffObject, Status } = useLine();

  pageProps.liff = liffObject;
  pageProps.status = Status;

  return (
    <>
        <Component {...pageProps} />
    </>
  );
}
