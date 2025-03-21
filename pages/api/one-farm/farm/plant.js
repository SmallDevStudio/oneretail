import { firestore } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getNowTimestamp, generateId } from "@/lib/helpers";

export default async function handler(req, res) {
  const { userId, type, tile } = req.body;
  if (!userId || !type) return res.status(400).json({ error: "Missing data" });

  const crop = {
    id: generateId("crop"),
    type,
    plantedAt: getNowTimestamp(),
    tile: tile || null,
  };

  const ref = doc(firestore, "farms", userId);
  await updateDoc(ref, {
    crops: arrayUnion(crop),
    updatedAt: getNowTimestamp(),
  });

  return res.status(200).json({ message: "Crop planted", crop });
}
