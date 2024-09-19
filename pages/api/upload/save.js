import connectMongoDB from '@/lib/services/database/mongodb';
import Library from '@/database/models/Library';

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB(); // เชื่อมต่อ MongoDB

    switch (method) {
        case 'POST': { 
            try {
                // บันทึกข้อมูลไฟล์ลงในฐานข้อมูล
                const newLibraryEntry = new Library(req.body);

                await newLibraryEntry.save();

                res.status(200).json({ success: true, library: newLibraryEntry });
            } catch (error) {
                console.error('Error uploading file:', error);
            }

            break;
        }

        default:
            res.setHeader('Allow', ['POST']);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}