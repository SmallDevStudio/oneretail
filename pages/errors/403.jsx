import Link from "next/link";

export default function PermissionDeniedPage() {
  return (
    <div className="error-container">
      <h1>403</h1>
      <p>คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
      <Link href="/" className="error-btn">
        กลับไปหน้าแรก
      </Link>
    </div>
  );
}
