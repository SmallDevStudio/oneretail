import connetMongoDB from "@/lib/services/database/mongodb";
import Examinations from "@/database/models/Examinations";
import ExaminationDeleted from "@/database/models/ExaminationDeleted";

export default async function handler(req, res) {
    await connetMongoDB();
    const { id, userId } = req.query;
    
    switch (req.method) {
        case "PUT":
            try {
                const examination = await Examinations.findOne(id);
                if (!examination) {
                    res.status(404).json({ success: false, error: "Examination not found" });
                }

                const deletedExamination = new ExaminationDeleted({
                    examId: id,
                    userId: userId
                });

                await deletedExamination.save();

                await Examinations.findByIdAndUpdate(id, {
                    isDeleted: true
                }, { new: true });

                res.status(200).json({ success: true, data: examination });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}