import connectMongoDB from "@/lib/services/database/mongodb";
import UserJoinEvent from "@/database/models/UserJoinEvent";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    
    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                const { eventId } = req.query;

                const userJoinEvent = await UserJoinEvent.findOne({ eventId: eventId });
                
                const empIds = userJoinEvent.map(userJoinEvent => userJoinEvent.empId);
                
                if (empIds.length === 0) {
                    return res.status(200).json({ success: true, data: [] });
                }

                const emps = await Users.find({ empId: { $in: empIds } });

                const empMap = emps.reduce((acc, emp) => {
                    acc[emp.empId] = emp;
                    return acc;
                }, {});

                const enrichedUserJoinEvent = userJoinEvent.map(userJoinEvent => ({
                    ...userJoinEvent._doc,
                    emp: empMap[userJoinEvent.empId] || null
                }));

                res.status(200).json({ success: true, data: enrichedUserJoinEvent });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            try {
                const userJoinEvent = await UserJoinEvent.create(req.body);
                res.status(201).json(userJoinEvent);
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'PUT':
            try {
                const { id, ...data } = req.body;
                const userJoinEvent = await UserJoinEvent.findByIdAndUpdate(id, data, { new: true, runValidators: true });
                if (!userJoinEvent) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: userJoinEvent });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const userJoinEvent = await UserJoinEvent.findByIdAndDelete(id);
                if (!userJoinEvent) {
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({ success: true, data: userJoinEvent });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: "Method not allowed" });
            break;
    }
}