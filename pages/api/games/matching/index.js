import connetMongoDB from "@/lib/services/database/mongodb";
import MatchingGame from "@/database/models/MatchingGame";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const games = await MatchingGame.find();
                res.status(200).json(games);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            try {
                const game = await MatchingGame.create(req.body);
                res.status(201).json(game);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'PUT':
            try {
                const { id, ...data } = req.body;
                const game = await MatchingGame.findByIdAndUpdate(id, data, { new: true });
                res.status(200).json(game);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const { id } = req.body;
                await MatchingGame.findByIdAndDelete(id);
                res.status(200).json({ success: true });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(405).json({ success: false, message: 'Method not allowed' });
            break;
    }
}