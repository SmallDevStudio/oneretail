import connetMongoDB from "@/services/database/mongoose/mongodb";
import Users from "@/database/models/Users";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed !!!" });
    } else {
        const { fullname, phone, address, pictureUrl, employee_id, line_id } = req.body;
        console.log(fullname, phone, address, pictureUrl, employee_id, line_id);
        await connetMongoDB();
        await Users.create({fullname, phone, address, pictureUrl, role: 'superadmin', active: true, employee_id, line_id});

        res.status(201).json({ message: "User created successfully" });
    }
}