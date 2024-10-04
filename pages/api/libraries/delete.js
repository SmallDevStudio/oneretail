import connetMongoDB from "@/lib/services/database/mongodb";
import Library from "@/database/models/Library";

export default async function handler(req, res) {
    const { method } = req;
    const { public_id } = req.query;

    await connetMongoDB(); // Corrected typo

    switch (method) {
        case "DELETE":
            try {
                // Find and delete the library item by public_id
                const library = await Library.findOneAndDelete({ public_id });
                
                if (!library) {
                    return res.status(404).json({ success: false, message: "Library item not found." });
                }

                res.status(200).json({ success: true, data: library });
            } catch (error) {
                // Log the error and return a detailed message
                console.error("Error while deleting library item:", error);
                res.status(500).json({ success: false, message: "Failed to delete the library item", error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: "Method not allowed" });
            break;
    }
}
