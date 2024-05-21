import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  console.log({ session });

  if (session) {
    return (
      <>
        <Image 
          src={session.user.image} 
          alt="profile" 
          className="rounded-full" 
          width={200}
          height={200}
          priority
          />
          Signed in as {session.user.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn('line')}>Sign in</button>
    </>
  )
}
