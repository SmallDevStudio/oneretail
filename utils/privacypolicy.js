import { db } from "@/lib/firebase1";
import { collection, addDoc } from "firebase/firestore";
import { getSession } from "next-auth/react";

export const trackClick = async (element) => {
  const session = await getSession();
  await addDoc(collection(db, "user_clicks"), {
    userId: session?.user?.id || "anonymous",
    element,
    time: new Date(),
  });
};

export const trackPageTime = () => {
  const start = Date.now();
  const beforeUnload = async () => {
    const session = await getSession();
    const duration = Date.now() - start;
    await addDoc(collection(db, "user_page_time"), {
      userId: session?.user?.id || "anonymous",
      duration, // ms
      url: window.location.href,
      time: new Date(),
    });
  };
  window.addEventListener("beforeunload", beforeUnload);
};

export const trackScrollOnce = () => {
  const start = Date.now();
  let hasTracked = false;

  const onScroll = async () => {
    if (hasTracked) return; // ✅ ป้องกันเรียกหลายครั้ง
    hasTracked = true;

    const session = await getSession();
    const duration = Date.now() - start;

    await addDoc(collection(db, "user_scroll_time"), {
      userId: session?.user?.id || "anonymous",
      duration, // เวลาที่ใช้ก่อน scroll
      url: window.location.href,
      time: new Date(),
    });

    // ✅ ลบ event หลังจากส่งแล้ว
    window.removeEventListener("scroll", onScroll);
  };

  window.addEventListener("scroll", onScroll);
};
