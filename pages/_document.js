import { Html, Head, Main, NextScript } from "next/document";
import { Analytics } from '@vercel/analytics/react';
import Script from "next/script";

export default function Document() {

  return (
    <Html lang="th">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/dist/icons/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/dist/icons/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/dist/icons/favicon-16x16.png"/>
        <link rel="icon" href="/dist/icons/favicon.ico"/>
      </Head>
      <body>
        <Main/>
        <NextScript />
        <Analytics />
      </body>

    </Html>
  );
}
