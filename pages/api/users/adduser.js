import { db } from "@/services/database/firebase/firebase";
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(200).json({ name: 'John Doe' });
    }

    const data = {
        empid: req.body.empid,
        fullname: req.body.fullname,
        phone: req.body.phone,
        address: req.body.address,
        userid: req.body.userid,
        pictureUrl: req.body.pictureUrl,
        role: 'admin',
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        logined_at: new Date()
    }

    const docRef = await db.collection("users").doc(data.empid).add(data);
    if (!docRef) {
        res.status(500).json({ docRef });
    }
    res.status(200).json({ docRef });
}