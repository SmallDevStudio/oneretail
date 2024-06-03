import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";

export default async function handler(req, res) {
    await connetMongoDB();
    const { slug } = req.query;
    const content = await Content.findOne({ slug });
    res.status(200).json(content); 
}