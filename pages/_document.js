import { Html, Head, Main, NextScript } from "next/document";
import { Analytics } from '@vercel/analytics/react';
import GoogleAnalytics from "./GoogleAnalytics";

export default function Document() {
  return (
    <Html lang="th">
      <Head>
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%/dist/icons/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="%PUBLIC_URL%/dist/icons/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="%PUBLIC_URL%/dist/icons/favicon-16x16.png"/>
      </Head>
      <body>
        <Main/>
        <NextScript />
        <Analytics />
        <GoogleAnalytics />
      </body>

    </Html>
  );
}
