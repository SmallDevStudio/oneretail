import connetMongoDB from "@/lib/services/database/mongodb";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case "GET":
            try {
                const { empId } = req.query;
                const emp = await Emp.findOne({ empId });
                res.status(200).json({ success: true, data: emp });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "PUT":
            try {
                const { empId } = req.query;
                const { ...data } = req.body;
                const emp = await Emp.findOneAndUpdate({ empId }, data, {
                    new: true,
                });
                res.status(200).json({ success: true, data: emp });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        case "DELETE":
            try {
                const { empId } = req.query;
                const emp = await Emp.findOneAndDelete({ empId });
                res.status(200).json({ success: true, data: emp });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            
        default:
            res.status(400).json({ success: false });
            break;
    }
}