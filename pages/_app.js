import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import useLine from "@/lib/hook/useLine";
import useSession from "@/lib/hook/useSession";
import "@/styles/globals.css";
import { Suspense } from "react";

function App({ Component, pageProps }) {
  const { session } = useSession();
  console.log('session:', session);
  // const { liffObject, status } = useLine();

  // pageProps.liffObject = liffObject;
  // pageProps.status = status;

  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...pageProps} />
    </Suspense>
  )
}

export default App;
