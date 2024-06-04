import connectMongoDB from "@/lib/services/database/mongodb";
import Question from "@/database/models/Question";

async function addGroupToQuestions() {
  await connectMongoDB();
  const questions = await Question.find({});
  for (const question of questions) {
    question.group = 'default'; // กำหนดกลุ่มเริ่มต้น
    await question.save();
  }
  console.log('Group added to all questions');
}

addGroupToQuestions();