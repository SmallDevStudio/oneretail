import connetMongoDB from "@/lib/services/database/mongodb";
import SurveySettings from "@/database/models/SurveySettings";

export default async function handler(req, res) {
    await connetMongoDB();

    if (req.method === "GET") {
        const settings = await SurveySettings.findOne({});
        res.status(200).json(settings);
    } else if (req.method === "POST") {
        const { isSurveyEnabled } = req.body;
        const result = await SurveySettings.updateOne({}, { $set: { isSurveyEnabled } }, { upsert: true });
        res.status(200).json(result);
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}