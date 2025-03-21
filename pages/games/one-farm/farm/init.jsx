import { firestore } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getNowTimestamp } from "@/lib/helpers";

export default async function handler(req, res) {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: "Missing uid" });

  const userRef = doc(firestore, "farms", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return res.status(200).json({ message: "Farm already exists" });
  }

  const defaultFarm = {
    coins: 500,
    barn: [],
    crops: [],
    animals: [],
    createdAt: getNowTimestamp(),
    updatedAt: getNowTimestamp(),
  };

  await setDoc(userRef, defaultFarm);
  return res.status(200).json({ message: "Farm created" });
}
