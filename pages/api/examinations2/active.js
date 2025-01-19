import connetMongoDB from "@/lib/services/database/mongodb";
import Examinations from "@/database/models/Examinations";

export default async function handler(req, res) {
    await connetMongoDB();
    const { id, active } = req.query;
    
    switch (req.method) {
        case "PUT":
            try {
                const examination = await Examinations.findById(id);
                if (!examination) {
                    return res.status(404).json({ success: false, error: "Examination not found" });
                }

                await Examinations.findByIdAndUpdate(id, {
                    active: active
                }, { new: true });

                await examination.save();

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