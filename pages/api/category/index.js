import connetMongoDB from "@/services/database/mongoose/mongodb";
import Caterory from "@/database/models/category";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB()
        .then(() => {
            Caterory.find({})
            .then((caterogy) => {
                res.status(200).json({ caterogy });
            })
            .catch((error) => {
                res.status(500).json({ error });
            });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
    } else if (req.method === "POST") {
        const caterogyData = req.body;
        await connetMongoDB()
        .then(() => {
            Caterory.create(caterogyData)
            .then((caterogy) => {
                res.status(201).json({ caterogy });
            })
            .catch((error) => {
                res.status(500).json({ error });
            });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
