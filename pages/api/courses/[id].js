import connetMongoDB from "@/lib/services/database/mongodb";
import Courses from "@/database/models/Courses";
import ReviewQuiz from "@/database/models/ReviewQuiz";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const course = await Courses.findOne({ _id: id });
                if (!course) {
                    return res.status(404).json({ success: false, message: "Course not found" });
                }

                const questions = await ReviewQuiz.find({ courseId: id });
                
                const courseWithQuestions = {
                    ...course.toObject(),
                    questions,
                };

                res.status(200).json({ success: true, data: courseWithQuestions });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "PUT":
            try {
                const { title, description, category, group, active, questions } = req.body;

                // Update course details
                const course = await Courses.findByIdAndUpdate(
                    id,
                    { title, description, category, group, active },
                    { new: true, runValidators: true }
                );
                if (!course) {
                    return res.status(404).json({ success: false, message: "Course not found" });
                }

                // Update or create questions
                if (Array.isArray(questions)) {
                    for (const question of questions) {
                        if (question._id) {
                            await ReviewQuiz.findByIdAndUpdate(question._id, question, { new: true });
                        } else {
                            const newQuestion = new ReviewQuiz({ ...question, courseId: id });
                            await newQuestion.save();
                            course.questions.push(newQuestion._id);
                        }
                    }
                    await course.save();
                }

                res.status(200).json({ success: true, data: course });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case "DELETE":
            try {
                await ReviewQuiz.deleteMany({ courseId: id });
                const course = await Courses.findByIdAndDelete(id);
                if (!course) {
                    return res.status(404).json({ success: false, message: "Course not found" });
                }
                res.status(200).json({ success: true, data: course });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Invalid method" });
            break;
    }
}
