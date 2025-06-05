import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase"; // Firebase client SDK

export default function Avatar({ src, size, userId }) {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    if (!userId) return;

    const userStatusRef = ref(database, `users/${userId}/online`);

    // ฟังสถานะออนไลน์แบบเรียลไทม์
    const unsubscribe = onValue(userStatusRef, (snapshot) => {
      if (snapshot.exists()) {
        setIsOnline(snapshot.val());
      } else {
        setIsOnline(false); // หากไม่มีข้อมูลใน Firebase ให้ถือว่า offline
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [userId]);

  const url = `/p/${userId}`;

  return (
    <div className="relative">
      <Image
        src={imgSrc} // ใช้ imgSrc แทน src เดิม
        alt="Avatar"
        width={100}
        height={100}
        className="rounded-full cursor-pointer object-contain bg-white border"
        style={{
          width: size ? size : "auto",
          height: size ? size : "auto",
        }}
        loading="lazy"
        onClick={() => router.push(url)}
        onError={() => setImgSrc("/images/Avatar.jpg")} // ตั้งค่า imgSrc เมื่อเกิดข้อผิดพลาด
      />
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
      )}
    </div>
  );
}
