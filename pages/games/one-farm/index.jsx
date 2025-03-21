import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Farm() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
  }, [session, status]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Farm</h1>
      <div className="grid grid-cols-2 gap-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => router.push("/games/one-farm/farm/farm")}
        >
          Farm
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => router.push("/games/one-farm/farm/barn")}
        >
          Barn
        </button>
      </div>
    </div>
  );
}
