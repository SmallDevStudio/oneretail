import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export default function useFarm(uid) {
  const [farm, setFarm] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const ref = doc(firestore, "farms", uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setFarm(snap.data());
      }
    });

    return () => unsub();
  }, [uid]);

  return farm;
}
