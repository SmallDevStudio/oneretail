import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import ContentViews from "@/database/models/ContentViews";


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

        const view = await ContentViews.create({ contentId, userId });

        if (!view) {
          return res.status(500).json({ success: false, message: 'Failed to create view' });
        }
    
        res.status(200).json({ success: true, data: content });
      } catch (error) {
        res.status(400).json({ success: false });
      }
};
