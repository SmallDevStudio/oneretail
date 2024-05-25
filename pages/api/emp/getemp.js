import { customInitApp } from "@/services/database/firebase/firebase-admin-config";
import { Firestore } from "firebase/firestore";

customInitApp();

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed !!!" });
    } else {
        const db = new Firestore();
        const userRef = req.body;
        const docRef = db.collection("users").doc(userRef.empid);
        const doc = await docRef.get();
        if (!doc.exists) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json(doc.data());
        }
    }
}