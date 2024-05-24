import { db } from "@/services/database/firebase/firebase";
import { setDoc, doc } from "firebase/firestore";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
    }
    const { empid, fullname, phone, address, pictureUrl } = req.body;
    console.log('req.body:', req.body);
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
        console.log('userRef:', userRef);

        try {
            const docRef = await setDoc(doc(db, 'users', empid), userRef);
            if (!docRef) {
                res.status(500).json({ message: 'Error adding user' });
            }
            res.status(200).json({ message: 'User added successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'failed' });
        }
}