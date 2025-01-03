import connetMongoDB from "@/lib/services/database/mongodb";
import Courses from "@/database/models/Courses";
import ReviewQuiz from "@/database/models/ReviewQuiz";
import Gallery from "@/database/models/Gallery";

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
                    const { title, description, category, group, active, questions, driveUrl, creator } = req.body;

                    console.log('driveUrl:', driveUrl);
            
                    // อัปเดตข้อมูลใน Gallery ถ้ามี driveUrl
                    let galleryId = null;
                    if (driveUrl) {
                        const existingGallery = await Gallery.findOne({ driveUrl });
            
                        if (existingGallery) {
                            // อัปเดต Gallery ที่มีอยู่
                            existingGallery.title = title;
                            existingGallery.description = description;
                            await existingGallery.save();
                            galleryId = existingGallery._id;
                        } else {
                            // สร้าง Gallery ใหม่
                            const newGallery = await Gallery.create({
                                title,
                                description,
                                driveUrl,
                                creator,
                            });
                            galleryId = newGallery._id;
                        }
                    }
            
                    // อัปเดตข้อมูลใน Courses
                    const course = await Courses.findByIdAndUpdate(
                        id,
                        {
                            title,
                            description,
                            category,
                            group,
                            active,
                            driveUrl,
                            galleryId, // อัปเดต galleryId ถ้ามี
                        },
                        { new: true, runValidators: true }
                    );
            
                    if (!course) {
                        return res.status(404).json({ success: false, message: "Course not found" });
                    }
            
                    // อัปเดตหรือสร้างคำถาม (questions)
                    if (Array.isArray(questions)) {
                        const updatedQuestions = [];
            
                        for (const question of questions) {
                            if (question._id) {
                                // อัปเดตคำถามที่มีอยู่
                                const updatedQuestion = await ReviewQuiz.findByIdAndUpdate(
                                    question._id,
                                    question,
                                    { new: true }
                                );
                                if (updatedQuestion) {
                                    updatedQuestions.push(updatedQuestion._id);
                                }
                            } else {
                                // สร้างคำถามใหม่
                                const newQuestion = await ReviewQuiz.create({
                                    ...question,
                                    courseId: id,
                                });
                                updatedQuestions.push(newQuestion._id);
                            }
                        }
            
                        // อัปเดต `questions` ใน Course
                        course.questions = updatedQuestions;
                        await course.save();
                    }
            
                    res.status(200).json({ success: true, data: course });
                } catch (error) {
                    console.error(error);
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
