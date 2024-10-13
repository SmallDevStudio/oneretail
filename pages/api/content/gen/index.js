import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
  await connectMongoDB();
  const { method, query } = req;

  switch (method) {
    case 'GET':
      try {
        let contents;
        const filter = { publisher: true };
        
        if (query.category) {
          filter.categories = query.category;
        } else if (query.subcategory) {
          filter.subcategories = query.subcategory;
        } else if (query.group) {
          filter.groups = query.group;
        }
        
        contents = await Content.find({})
          .sort({ createdAt: -1 })
          .populate('categories')
          .populate('subcategories')
          .populate('groups')
          .populate('subgroups');

        res.status(200).json({ success: true, data: contents });
      } catch (error) {
        console.error('Error fetching content:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    default:
      res.status(400).json({ success: false, error: 'Invalid request method' });
      break;
  }
}
