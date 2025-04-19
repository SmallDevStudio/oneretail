import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";

export default function Ebook() {
  const [url, setUrl] = useState("");
  const [redirected, setRedirected] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading" || !session || !id) return;

    const fetchAndUseEbook = async () => {
      try {
        const res = await axios.get(`/api/ebook/${id}`);
        const ebookUrl = res.data.data?.url;
        const active = res.data.data?.active;
        setUrl(ebookUrl);
        setIsActive(active);

        if (!active) return;

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

  return !isActive ? (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4 text-[#0056FF]">
        Ebook ปิดการใช้งาน
      </h1>
      <button
        className="bg-[#F2871F] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => router.push("/")}
      >
        กลับสู้หน้าแรก
      </button>
    </div>
  ) : (
    <Loading />
  );
}
