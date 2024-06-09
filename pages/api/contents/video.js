import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    if (method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
      }
    
      try {
        const { categoryId } = query;
        console.log('categoryId:', categoryId); // Log the categoryId
    
        // Convert categoryId to ObjectId
        let categoryObjectId;
        try {
          categoryObjectId = new mongoose.Types.ObjectId(categoryId);
        } catch (err) {
          return res.status(400).json({ success: false, error: 'Invalid category ID format' });
        }
        console.log('categoryObjectId:', categoryObjectId); // Log the ObjectId
    
        // Use aggregation pipeline to get a random document filtered by categoryId
        const contents = await Content.aggregate([
          { $match: { categories: categoryObjectId } },
          { $sample: { size: 1 } }
        ]);
    
        if (contents.length === 0) {
          return res.status(200).json({ success: true, data: [] });
        }
    
        const content = contents[0];
        console.log('Random content found:', content); // Log the random content found
    
        const user = await Users.findOne({ userId: content.author });
        console.log('User found:', user); // Log the user found
    
        const populatedContent = {
          ...content,
          author: user || null
        };
        console.log('Populated content:', populatedContent); // Log the populated content
    
        res.status(200).json({ success: true, data: populatedContent });
      } catch (error) {
        console.error('Error:', error); // Log the error
        res.status(400).json({ success: false, error: error.message });
      }
    }
