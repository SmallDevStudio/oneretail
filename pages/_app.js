import "@/styles/globals.css";
import { Suspense } from "react";
import useSession from "@/lib/hook/useSession";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

function App({ Component, pageProps }) {
 // const { session, loading } = useSession();
 // const router = useRouter();

 // if (loading) return <Loading />;
 // if (!session) return router.push("/login");
  
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...pageProps} />
    </Suspense>
  )
}

export default App;
