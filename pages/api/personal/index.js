import connetMongoDB from "@/lib/services/database/mongodb";
import UsePersonalizedPreTest from "@/database/models/UsePersonalizedPreTest";
import UsePersonalizedPostTest from "@/database/models/UsePersonalizedPostTest";
import UsePersonalizedContent from "@/database/models/UsePersonalizedContent";

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query;
    await connetMongoDB();

    switch (method) {
        case 'GET':
                try {
                    // Fetch pretest, posttest, and contents data
                    const pretest = await UsePersonalizedPreTest.findOne({ userId });
                  
                    const posttest = await UsePersonalizedPostTest.findOne({ userId });
                  
                    const contents = await UsePersonalizedContent.find({ userId });

                    res.status(200).json({ success: true, data: { pretest, posttest, contents } });
                } catch (error) {
                    res.status(400).json({ success: false, error: error.message });
                }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}