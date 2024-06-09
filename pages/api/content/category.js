import connetMongoDB from "@/lib/services/database/mongodb";
import mongoose from 'mongoose';
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import Category from "@/database/models/Category";
import Subcategory from "@/database/models/Subcategory";
import Group from "@/database/models/Group";

export default async function handler(req, res) {
    const { method, query } = req

    await connetMongoDB();

    if (method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
      }

      try {
        const { categoryId } = query;
        
        // Convert categoryId to ObjectId
        let categoryObjectId;
        try {
          categoryObjectId = new mongoose.Types.ObjectId(categoryId);
        } catch (err) {
          return res.status(400).json({ success: false, error: 'Invalid category ID format' });
        }
    
        const contents = await Content.find({ categories: categoryObjectId })
          .populate('categories')
          .populate('subcategories')
          .populate('groups');
    
        if (contents.length === 0) {
          return res.status(200).json({ success: true, data: [] });
        }
    
        const userId = contents.map(content => content.author);
        const users = await Users.find({ userId: { $in: userId } });
        const userMap = users.reduce((acc, user) => {
          acc[user.userId] = user;
          return acc;
        }, {});
    
        const populatedContents = contents.map(content => {
          content = content.toObject();
          content.author = userMap[content.author] || null;
          return content;
        });
    
        res.status(200).json({ success: true, data: populatedContents });
      } catch (error) {
        console.error('Error:', error); // Log the error
        res.status(400).json({ success: false, error: error.message });
      }
    }