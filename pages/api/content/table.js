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
            const contents = await Content.findOne({});
            const categories = await Category.find({_id: { $in: contents.categories }});
            const groups = await Group.find({_id: { $in: contents.groups }});
            const subcategories = await Subcategory.find({_id: { $in: contents.subcategories }});
            const users = await Users.find({userId: { $in: contents.author }});
            const content = {
                ...contents._doc,
                categories: categories.title,
                subcategories: subcategories.title,
                groups: groups.name,
                usersImage: users.pictureUrl,
                usersId: users.userId
            }
            res.status(200).json(content);
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