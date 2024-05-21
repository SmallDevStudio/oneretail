import React from "react";
import { useLine } from "@/lib/hook/useLine";

export default function Home(props) {
  const { liffObject, status } = useLine();
  const { login, logout } = useLine();

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      
    </main>
  );
}
