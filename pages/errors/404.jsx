import Link from "next/link";
import { useRouter } from "next/router";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="error-container">
      <h1>404</h1>
      <p>ไม่พบหน้านี้</p>
      <div className="error-btn" onClick={() => router.back()}>
        กลับหน้าก่อน
      </div>
    </div>
  );
}
