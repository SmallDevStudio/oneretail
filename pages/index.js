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

  const {profile: {userId, displayName, pictureUrl, statusMessage}, version,} = useLineInfo({
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
        <p>{userId}</p>
        <p>{displayName}</p>
        <p>{pictureUrl}</p>
        <p>{statusMessage}</p>

        <button onClick={handleClick}>Logout</button>

      </div>
    );
  }
 
}