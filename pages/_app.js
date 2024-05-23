import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import "@/styles/globals.css";

function App({ Component, pageProps }) {

  return (
      <Component {...pageProps} />
  )
}

export const getServerSideProps = async (ctx) => {
  const session = getIronSession(ctx.req, ctx.res, sessionOptions);
  if (!session.get("isLoggedIn")) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {session},
  };
}

export default App;
