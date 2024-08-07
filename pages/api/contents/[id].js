import connetMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Category from "@/database/models/Category";
import Group from "@/database/models/Group";
import SubGroup from "@/database/models/SubGroup";
import Subcategory from "@/database/models/Subcategory";
import Users from "@/database/models/users";

export default async function handler(req, res) {
   if (req.method === "DELETE") {
     const { id } = req.query;
     await connetMongoDB();
     const deletedContent = await Content.findByIdAndDelete(id);
     res.status(200).json(deletedContent);
   } else if (req.method === "GET") {
     const { id } = req.query;
     await connetMongoDB();
     const content = await Content.findOne({ _id: id });
     const categories = await Category.find({ _id: { $in: content.categories } });
     const groups = await Group.find({ _id: { $in: content.groups } });
     const sugroups = await SubGroup.find({ _id: { $in: content.sugroups } });
     const subcategories = await Subcategory.find({ _id: { $in: content.subcategories } });
     const users = await Users.find({ userId: { $in: content.author } });
     const contents = {
       ...content._doc,
       categories,
       groups,
       subcategories,
       users
     }
     res.status(200).json(contents);
   }
}