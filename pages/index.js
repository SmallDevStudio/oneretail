"use client";
import Head from "next/head";
import useLine from "@/lib/hook/useLine";

export default function Home(props) {
  const { status } = props

  const { login, logout, getProfile, getAccessToken } = useLine();
  console.log(getAccessToken, getProfile);

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
        <button onClick={handleClick}>Logout</button>
      </div>
    );
  }
 
}