import connetMongoDB from "@/lib/services/database/mongodb";
import Comments from "@/database/models/Comments";

export default async function handler(req, res) {
    if (req.method === "GET") {
        await connetMongoDB();
        const comments = await Comments.find({});
        res.status(200).json(comments);
    } else if (req.method === "POST") {
        const { comment, contentId, userId, fullname, userImage, username } = req.body;
        await connetMongoDB();
        console.log("Received Data: ", { comment, contentId, userId, fullname, userImage, username }); // ตรวจสอบข้อมูลที่ได้รับ
        const comments = await Comments.create({ comment, contentId, userId, fullname, userImage, username });
        console.log("Saved Data: ", comments); // ตรวจสอบข้อมูลที่ถูกบันทึก
        res.status(201).json(comments);

    } else if (req.method === "PUT") {
        const { id, ...data } = req.body;
        await connetMongoDB();
        const comment = await Comments.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json(comment);
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}