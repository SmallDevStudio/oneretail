import connectMongoDB from "@/lib/services/database/mongodb";
import Question from "@/database/models/Question";

export default async function handler(req, res) {
  const { method } = req;
  await connectMongoDB();

  if (method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // อัพเดทกลุ่มทุกคำถาม
  try {
    const questions = await Question.find({});
    for (const question of questions) {
      question.group = 'default'; // กำหนดกลุ่มเริ่มต้น
      await question.save();
    }
    console.log({ success: true, message: 'Group added to all questions' });
  } catch (error) {
    console.error('Error adding group to questions:', error);
    res.status(500).json({ success: false, error: 'Error adding group to questions' });
  }
}

