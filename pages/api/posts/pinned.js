import connetMongoDB from "@/lib/services/database/mongodb";
import Post from "@/database/models/Post";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case "PUT":
            try {
                const { id, pinned } = req.body;

                const post = await Post.findById(id);

                if (!post) {
                    return res.status(404).json({ success: false, error: "Post not found" });
                }

                post.pinned = pinned;
                await post.save();

                res.status(200).json(post);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;
    }
}