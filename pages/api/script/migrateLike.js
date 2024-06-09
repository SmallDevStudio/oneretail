import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";


export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    if (method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
      }

      try {
        const contents = await Content.find();
    
        for (const content of contents) {
          if (typeof content.likes === 'number') {
            content.likes = [];
            await content.save();
          }
        }
    
        res.status(200).json({ success: true, message: 'Migration complete.' });
      } catch (error) {
        console.error('Error during migration:', error);
        res.status(500).json({ success: false, error: 'Error during migration' });
      }
    }