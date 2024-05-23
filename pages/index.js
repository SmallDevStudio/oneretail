"use client";
import Head from "next/head";
import useLine from "@/lib/hook/useLine";
import Image from "next/image";

export default function Home(props) {
  const { status } = props

  const { login, logout, profile} = useLine();
  const { userId, displayName, pictureUrl, statusMessage } = profile;

  const handleClick = () => {
    logout();
    window.location.reload();
  };

  if (status !== 'inited') {
    return (
      <div>
        <Head>
          <title>One Retail</title>
        </Head>
        <button onClick={login}>Login</button>
      </div>
    );
  } else {
    return (
      <div>
        <Head>
          <title>One Retail</title>
        </Head>

        <h1>Profile</h1>
        <Image src={pictureUrl} alt={displayName} width={200} height={200} className="rounded-full"/>
        <p>{userId}</p>
        <p>{displayName}</p>
        <p>{statusMessage}</p>

        <button onClick={handleClick}>Logout</button>

      </div>
    );
  }
 
}