import Head from "next/head";
import useLine from "@/lib/hook/useLine";



export default function Home(props) {
  const { status } = props

  const { login, logout } = useLine();

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
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
 
}