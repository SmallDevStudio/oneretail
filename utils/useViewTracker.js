// utils/useViewTracker.js
import { useEffect, useRef } from "react";

export const useViewTracker = ({ postId, userId, mediaType }) => {
  const startTime = useRef(null);
  const observerRef = useRef(null);

  const startTracking = () => {
    startTime.current = new Date();
  };

  const stopTracking = async () => {
    if (startTime.current) {
      const endTime = new Date();
      const duration = endTime - startTime.current;
      startTime.current = null;

      await fetch("/api/post/viewlog", {
        method: "POST",
        body: JSON.stringify({
          postId,
          userId,
          mediaType,
          startTime: new Date(Date.now() - duration),
          endTime,
          duration,
        }),
        headers: { "Content-Type": "application/json" },
      });
    }
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startTracking();
      } else {
        stopTracking();
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.5,
    });
    observerRef.current && observer.observe(observerRef.current);
    return () => {
      observer.disconnect();
      stopTracking();
    };
  }, []);

  return observerRef;
};
