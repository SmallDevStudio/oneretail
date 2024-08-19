import connectMongoDB from "@/lib/services/database/mongodb";
import mongoose from 'mongoose';
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import ContentViews from "@/database/models/ContentViews";

export default async function handler(req, res) {
  const { method, query } = req;

  await connectMongoDB();

  if (method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { categoryId } = query;

    let categoryObjectId;
    try {
      categoryObjectId = new mongoose.Types.ObjectId(categoryId);
    } catch (err) {
      return res.status(400).json({ success: false, error: 'Invalid category ID format' });
    }

    const contents = await Content.find({ categories: categoryObjectId, publisher: true })
      .sort({ createdAt: -1 })
      .populate('categories')
      .populate('subcategories')
      .populate('groups')
      .populate('subgroups');

    if (contents.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const contentIds = contents.map(content => content._id);
    const contentViews = await ContentViews.find({ contentId: { $in: contentIds } }).select('userId contentId createdAt').sort({ createdAt: -1 });

    const userIds = contents.map(content => content.author);
    const users = await Users.find({ userId: { $in: userIds } }).select('userId fullname pictureUrl role');
    const userMap = users.reduce((acc, user) => {
      acc[user.userId] = user;
      return acc;
    }, {});

    const contentViewsMap = contentViews.reduce((acc, view) => {
      if (!acc[view.contentId]) {
        acc[view.contentId] = [];
      }
      acc[view.contentId].push(view);
      return acc;
    }, {});

    const populatedContents = contents.map(content => {
      content = content.toObject();
      content.author = userMap[content.author] || null;
      content.contentviews = contentViewsMap[content._id] || [];
      return content;
    });

    res.status(200).json({ success: true, data: populatedContents });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
}
