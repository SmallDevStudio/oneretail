// pages/api/quizGroups.js
import connectMongoDB from "@/lib/services/database/mongodb";
import QuizGroup from "@/database/models/QuizGroup";
import Question from "@/database/models/Question";

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === 'POST') {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required' });
      }

      const existingGroup = await QuizGroup.findOne({ name });
      if (existingGroup) {
        return res.status(400).json({ success: false, message: 'Group already exists' });
      }

      const quizGroup = new QuizGroup({ name });
      await quizGroup.save();

      res.status(201).json({ success: true, data: quizGroup });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const quizGroups = await QuizGroup.find({});
      res.status(200).json({ success: true, data: quizGroups });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const questions = await Question.find({});
      const groups = [...new Set(questions.map(q => q.group))];
      const quizGroups = await QuizGroup.find({});
      const existingGroups = quizGroups.map(q => q.name);

      for (const group of groups) {
        if (!existingGroups.includes(group)) {
          const newGroup = new QuizGroup({ name: group });
          await newGroup.save();
        }
      }

      res.status(200).json({ success: true, message: 'Quiz groups updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
