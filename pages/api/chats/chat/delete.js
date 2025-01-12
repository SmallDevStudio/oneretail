import admin from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { chatId } = req.query;

    try {
        const chatRef = admin.database().ref(`chats/${chatId}`);
        await chatRef.remove();
        return res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
        console.error("Error deleting chat:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}