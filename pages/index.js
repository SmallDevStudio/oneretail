import Head from "next/head";
import useLine from "@/lib/hook/useLine";
import useLineInfo from "@/lib/hook/useLineInfo";


export default function Home(props) {
  const { liffObject, Status } = props

  const { login, logout } = useLine();
  const { accesstoken, idtoken, version } = useLineInfo();

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
      <p>LIFF ID: {process.env.NEXT_PUBLIC_LIFF_ID}</p>
      <p>Access Token: {accesstoken}</p>
      <p>ID Token: {idtoken}</p>
      <p>LIFF version: {version}</p>

    </>
  )
}