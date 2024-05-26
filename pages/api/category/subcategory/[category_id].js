import connetMongoDB from "@/services/database/mongoose/mongodb";
import SubCategory from "@/database/models/subcategory";
export default async function handler(req, res) {
    if (req.method === "GET") {
        const { category_id } = req.query;


    } else if (req.method === "POST") {

    }
}