import { db } from "@/services/database/firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
    }
    const { empid, fullname, phone, address, pictureUrl } = req.body;
    console.log(req.body);
    try {
        // Add the user to the database
        const userRef = {
            empid,
            fullname,
            phone,
            address,
            pictureUrl,
            role: 'admin',
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        console.log(userRef);
        
        const docRef = await db.collection('users').doc(empid).set(userRef);
        if (!docRef) {
            res.status(500).json({ message: 'Failed to add user' });
        } else {
            res.status(200).json({ message: 'User added successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}