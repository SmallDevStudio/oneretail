import { db } from "@/services/database/firebase/firebase";
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(200).json({ name: 'John Doe' });
    }

    const data = {
        empid: req.body.empid,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        userid: req.body.userid,
        pictureUrl: req.body.pictureUrl,
        created_at: req.body.created_at,
        updated_at: new Date(),
        logined_at: new Date()
    }

    const docRef = await db.collection("emp_users").doc(data.empid).set(data);
    if (!docRef) {
        res.status(500).json({ docRef });
    }
    res.status(200).json({ docRef });
}