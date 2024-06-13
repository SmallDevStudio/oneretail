import connetMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";

export default async function handler(req, res) {
    const { method } = req;
    const { userId } = req.query;
    connetMongoDB();
    
    switch (method) {
        case 'GET':
            try {
                // Fetch surveys for the given userId
                const surveys = await Survey.find({ userId });
            
                if (surveys.length === 0) {
                  return res.status(404).json({ error: 'No surveys found for this user.' });
                }
            
                // Calculate total score
                const totalScore = surveys.reduce((acc, survey) => acc + survey.value, 0);
            
                // Maximum possible score (number of surveys * 5)
                const maxScore = surveys.length * 5;
            
                // Calculate percentage
                const percentage = (totalScore / maxScore) * 100;
            
                // Return the results
                res.status(200).json({
                  userId,
                  surveypoint: totalScore,
                  percent: `${percentage.toFixed(2)}%`,
                });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, error: 'Method not allowed' });
            break;
    }
}