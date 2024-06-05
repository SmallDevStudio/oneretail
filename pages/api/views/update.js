import connetMongoDB from "@/lib/services/database/mongodb";
import View from "@/database/models/View";
import Content from "@/database/models/Content";


export default async function handler(req, res) {
    const { contentId, userId } = req.body;
    await connetMongoDB();

    try {
        const content = await Content.findById(contentId);
        if (!content) {
          return res.status(404).json({ success: false, message: 'Content not found' });
        }
    
        // Update the view count
        content.views += 1;
        await content.save();
    
        res.status(200).json({ success: true, data: content });
      } catch (error) {
        res.status(400).json({ success: false });
      }
};
