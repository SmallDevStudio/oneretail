import Head from "next/head";
import useLine from "@/lib/hook/useLine";
import { getSession } from "@/lib/session/getSession";

export default function Home(props) {
  const { status } = props

  const { login, logout } = useLine();
  console.log(status)

  const handleClick = () => {
    logout();
    window.location.reload();
  };

  const session = getSession();
  console.log(session);

  if (status !== 'inited') {
    return (
      <div>
        <Head>
          <title>One Retail by TTB</title>
        </Head>
        <button onClick={login}>Login</button>
      </div>
    );
  } else {
    return (
      <div>
        <Head>
          <title>One Retail by TTB</title>
        </Head>
        <button onClick={handleClick}>Logout</button>
      </div>
    );
  }
 
}