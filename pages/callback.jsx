import { useState, useEffect } from "react";
import useLine from "@/lib/hook/useLine";
import { useRouter } from "next/router";
import useSession from "@/lib/hook/useSession";
import Loading from "@/components/Loading";

export default function Callback() {
  const { session, setSession } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { profile } = useLine();

  useEffect(() => {
    router.push("/register");
  }, []);

  return loading ? <Loading /> : null;
}