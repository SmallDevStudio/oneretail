import { db } from "@/services/database/firebase/firebase";
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
    }

    if (!req.body) {
        res.status(400).json({ message: 'No data provided' });
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
    };

    try {
        await db.collection('users').doc(data.empid).set(data);
        res.status(200).json({ message: 'User added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add user' });
    }
}