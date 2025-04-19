import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";

export default function Ebook() {
  const [url, setUrl] = useState("");
  const [redirected, setRedirected] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading" || !session || !id) return;

    const fetchAndUseEbook = async () => {
      try {
        const res = await axios.get(`/api/ebook/${id}`);
        const ebookUrl = res.data.data?.url;
        setUrl(ebookUrl);

        if (ebookUrl) {
          await axios.post("/api/ebook/useebook", {
            ebookId: id,
            userId: session?.user?.id,
          });

          setRedirected(true); // ป้องกัน loop
          window.location.href = ebookUrl;
        }
      } catch (error) {
        console.error("Error fetching or using ebook:", error);
      }
    };

    if (!redirected) {
      fetchAndUseEbook();
    }
  }, [id, session, status, redirected]);

  return <Loading />;
}
