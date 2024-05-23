import useLine from "@/lib/hook/useLine";
import { getLocalStorage, setLocalStorage } from "@/lib/localStorage";
import { useRouter } from "next/router";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const status = getLocalStorage("status");
  const { liffObject } = useLine();
  const router = useRouter();

  if (status === "login" && !liffObject) {
    setLocalStorage("status", "register");
    console.log("status Login....","status:", status, "liffObject:", liffObject);
    liffObject?.login();
  } else if (status === "register") {
    router.push("/auth/adduser");
    setLocalStorage("status", "inited");
  }

  pageProps.liffObject = liffObject;

  return <Component {...pageProps} />;
}
