import { db, auth } from "@/services/database/firebase/firebase-admin";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed !!!" });
    } else {
        const docs = await db.collection("emp").get();
        const data = docs.docs.map(doc => doc.data());
        res.status(200).json(data);
    }
}