import Head from "next/head";
import useLine from "@/lib/hook/useLine";
import useLineInfo from "@/lib/hook/useLineInfo";


export default function Home(props) {
  const { Status } = props

  const { login, logout } = useLine();

  if (Status !== 'inited') {
    return (
      <div>
        <Head>
          <title>LIFF Starter</title>
        </Head>
        <button onClick={login}>Login</button>
      </div>
    );
  }
  return (
    <>
      <Head>
          <title>LIFF Starter</title>
      </Head>
      <button onClick={logout}>Logout</button>

    </>
  )
}