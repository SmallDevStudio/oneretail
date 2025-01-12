import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ref, set, update, onDisconnect, get } from "firebase/database";
import { database } from "@/lib/firebase"; // Firebase client SDK

const useNetworkStatus = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id; // ปรับให้ตรงกับโครงสร้าง session ของคุณ
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" && navigator.onLine);

  useEffect(() => {
    if (!userId || !database) return; // หากไม่มี userId หรือ Firebase database ไม่ทำงานต่อ

    const userStatusRef = ref(database, `users/${userId}`);

    const initializeUser = async () => {
      try {
        const snapshot = await get(userStatusRef);

        if (!snapshot.exists()) {
          // หากไม่มีข้อมูลใน Firebase ให้สร้างข้อมูลใหม่
          await set(userStatusRef, {
            online: true,
            lastSeen: new Date().toISOString(),
          });
        } else {
          // หากข้อมูลมีอยู่แล้ว อัปเดตสถานะเป็นออนไลน์
          await update(userStatusRef, {
            online: true,
            lastSeen: new Date().toISOString(),
          });
        }

        // ตั้งค่าการอัปเดตเมื่อผู้ใช้ออกจากระบบ
        onDisconnect(userStatusRef)
          .update({
            online: false,
            lastSeen: new Date().toISOString(),
          })
          .catch((err) => console.error("Error setting onDisconnect:", err));
      } catch (error) {
        console.error("Error initializing user in Firebase:", error);
      }
    };

    const updateNetworkStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);

      update(userStatusRef, {
        online: online,
        lastSeen: new Date().toISOString(),
      }).catch((err) => console.error("Error updating network status:", err));
    };

    // เรียกฟังก์ชันเริ่มต้น
    initializeUser();

    // ตั้งค่า event listeners สำหรับสถานะเครือข่าย
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    // Cleanup: ลบ event listeners เมื่อ hook ถูก unmount
    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, [userId]);

  return isOnline;
};

export default useNetworkStatus;
