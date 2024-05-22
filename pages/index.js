"use client";
import Head from "next/head";
import useLine from "@/lib/hook/useLine";

export default function Home(props) {
  const { liffObject, status } = props

  const { login, logout, profile } = useLine();

  console.log("profile", profile);
  const { userId, displayName, pictureUrl, statusMessage } = profile;

  const handleClick = () => {
    logout();
    window.location.reload();
  };

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