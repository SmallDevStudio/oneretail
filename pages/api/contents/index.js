import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Category from "@/database/models/Category";
import Group from "@/database/models/Group";
import Subcategory from "@/database/models/Subcategory";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    await connetMongoDB();

    if (req.method === "GET") {
        try {
            const contents = await Content.find({})
            .sort({ createdAt: -1 })
            .populate('categories')
            .populate('subcategories')
            .populate('groups')
            .limit(10);
            res.status(200).json(contents);
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }

    if (req.method === "POST") {
        try {
            const content = await Content.create(req.body);
            res.status(201).json(content);
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}