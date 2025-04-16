import { db } from "@/lib/firebase1";
import { collection, addDoc } from "firebase/firestore";

export const trackClick = async (element, userId = "anonymous") => {
  await addDoc(collection(db, "user_clicks"), {
    userId,
    element,
    time: new Date(),
  });
};

export const trackPageTime = (userId = "anonymous") => {
  const start = Date.now();

  const beforeUnload = async () => {
    const duration = Date.now() - start;

    await addDoc(collection(db, "user_page_time"), {
      userId,
      duration, // ms
      url: window.location.href,
      time: new Date(),
    });
  };

  window.addEventListener("beforeunload", beforeUnload);
};

export const trackScrollOnce = (userId = "anonymous") => {
  const start = Date.now();
  let hasTracked = false;

  const onScroll = async () => {
    if (hasTracked) return;
    hasTracked = true;

    const duration = Date.now() - start;
    await addDoc(collection(db, "user_scroll_time"), {
      userId,
      duration,
      url: window.location.href,
      time: new Date(),
    });

    window.removeEventListener("scroll", onScroll);
  };

  window.addEventListener("scroll", onScroll);
};
