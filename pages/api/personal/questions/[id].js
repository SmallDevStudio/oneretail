import connetMongoDB from "@/lib/services/database/mongodb";
import PersonalizedQuizs from "@/database/models/PersonalizedQuizs";

export default async function handler(req, res) {
    const { method } = req
    const { id } = req.query

    await connetMongoDB()

    switch (method) {
        case 'GET':
            try {
                const question = await PersonalizedQuizs.findById(id)
                res.status(200).json({ success: true, data: question })
            } catch (error) {
                res.status(400).json({ success: false, error: error.message })
            }
            break
        case 'PUT':
            try {
                const { ...data } = req.body
                const question = await PersonalizedQuizs.findByIdAndUpdate(id, data, { new: true, runValidators: true })
                if (!question) {
                    return res.status(400).json({ success: false })
                }
                res.status(200).json(question)
            } catch (error) {
                res.status(400).json({ success: false, error: error.message })
            }
            break
        case 'DELETE':
            try {
                const question = await PersonalizedQuizs.findByIdAndDelete(id)
                if (!question) {
                    return res.status(400).json({ success: false })
                }
                res.status(200).json(question)
            } catch (error) {
                res.status(400).json({ success: false, error: error.message })
            }
            break
        default:
            res.status(400).json({ success: false })
            break
    }
}