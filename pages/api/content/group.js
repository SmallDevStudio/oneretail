import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { method, query } = req;

  await connectMongoDB();

  if (method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { groupId } = query;

    const groupObjectId = new mongoose.Types.ObjectId(groupId);

    const contents = await Content.find({ groups: groupObjectId, publisher: true })
      .sort({ createdAt: -1 })
      .populate('categories')
      .populate('subcategories')
      .populate('groups');

    if (contents.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const userIds = contents.map(content => content.author);
    const users = await Users.find({ userId: { $in: userIds } }).select('userId fullname pictureUrl role');
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
    console.error('Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
}
