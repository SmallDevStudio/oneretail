import { Html, Head, Main, NextScript } from "next/document";
import { Analytics } from '@vercel/analytics/react';
import GoogleAnalytics from "./GoogleAnalytics";

export default function Document() {
  return (
    <Html lang="th">
      <Head/>
      <body>
        <Main/>
        <NextScript />
        <Analytics />
        <GoogleAnalytics />
      </body>

    </Html>
  );
}
