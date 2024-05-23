import useLine from "@/lib/hook/useLine";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const { liffObject, status } = useLine();

  pageProps.liffObject = liffObject;
  pageProps.status = status;

  return <Component {...pageProps} />;
}
