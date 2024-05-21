import { useEffect } from "react";
import "@/styles/globals.css";

const liffID = process.env.NEXT_PUBLIC_LIFF_ID;

export default function App({ Component, pageProps }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async() => {
      const liff = (await import("@line/liff")).default;
      try {
        await liff.init({ liffId: liffID });
      }catch(err){
        console.log('liff init error', error.message);
      }
      if (!liff.isLoggedIn()) {
        liff.login();
      }
  })
  return <Component {...pageProps} />;
}
