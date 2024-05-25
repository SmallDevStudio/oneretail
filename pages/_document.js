import { Html, Head, Main, NextScript } from "next/document";
import { Analytics } from '@vercel/analytics/react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=320, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="dist/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="dist/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="dist/icons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <body>
        <Main/>
        <NextScript />
        <Analytics />
      </body>

    </Html>
  );
}
