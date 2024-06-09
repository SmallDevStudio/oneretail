import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import Category from "@/database/models/Category";
import Subcategory from "@/database/models/Subcategory";
import Group from "@/database/models/Group";
import mongoose from "mongoose";


export default async function handler(req, res) {
    const { method, query } = req;
    await connetMongoDB();

    if (method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
      }

      try {
        const { groupId } = query;
        console.log('groupId:', groupId); // Log the groupId
    
        // Convert groupId to ObjectId
        const groupObjectId = new mongoose.Types.ObjectId(groupId);
        console.log('groupObjectId:', groupObjectId); // Log the ObjectId
    
        const contents = await Content.find({ groups: groupObjectId })
          .populate('categories')
          .populate('subcategories')
          .populate('groups');
        console.log('Contents found:', contents); // Log the contents found
    
        if (contents.length === 0) {
          return res.status(200).json({ success: true, data: [] });
        }
    
        const userIds = contents.map(content => content.author);
        console.log('User IDs:', userIds); // Log the user IDs
    
        const users = await Users.find({ userId: { $in: userIds } });
        console.log('Users found:', users); // Log the users found
    
        const userMap = users.reduce((acc, user) => {
          acc[user.userId] = user;
          return acc;
        }, {});
    
        const populatedContents = contents.map(content => {
          content = content.toObject();
          content.author = userMap[content.author] || null;
          return content;
        });
        console.log('Populated contents:', populatedContents); // Log the populated contents
    
        res.status(200).json({ success: true, data: populatedContents });
      } catch (error) {
        console.error('Error:', error); // Log the error
        res.status(400).json({ success: false, error: error.message });
      }
    }