"use client";
import Head from "next/head";
import useLine from "@/lib/hook/useLine";
import useLineInfo from "@/lib/hook/useLineInfo";

export default function Home(props) {
  const { liffObject, status } = props

  const { login, logout } = useLine();

  const handleClick = () => {
    logout();
    window.location.reload();
  };

  const {idtoken, accesstoken, profile, version} = useLineInfo({
    liff: liffObject,
    status
  });

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

        <h1>Profile</h1>
        <pre>{JSON.stringify(profile, null, 2)}</pre>

        <h1>ID Token</h1>
        <pre>{idtoken}</pre>

        <h1>Access Token</h1>
        <pre>{accesstoken}</pre>

        <button onClick={handleClick}>Logout</button>

      </div>
    );
  }
 
}