import connetMongoDB from "@/services/database/mongoose/mongodb";
import Users from "@/database/models/users";


export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed !!!" });
    } else {
       
        await connetMongoDB()
        .then(() => {
            Users.find({})
            .then((users) => {
                res.status(200).json({ users });
            })
            .catch((error) => {
                res.status(500).json({ error });
            });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
    }
}