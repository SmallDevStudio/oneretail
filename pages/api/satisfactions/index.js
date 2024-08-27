import connetMongoDB from "@/lib/services/database/mongodb";
import Satisfaction from "@/database/models/Satisfaction";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    // Define the mapping for featureLike and improved values
    const featureMap = {
        1: 'ตารางอบรม',
        2: 'เกม',
        3: 'Learn มันส์',
        4: 'Success Story',
        5: 'ตารางอันดับ',
        6: 'One Retail Club',
        7: 'แลกของรางวัล'
    };

    switch (method) {
        case 'GET':
            try {
                const satisfactions = await Satisfaction.find({});
                const userIds = satisfactions.map(satisfaction => satisfaction.userId);
                const users = await Users.find({ userId: { $in: userIds } });
                const empIds = users.map(user => user.empId);
                const emps = await Emp.find({ empId: { $in: empIds } });

                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                const empMap = emps.reduce((acc, emp) => {
                    acc[emp.empId] = emp;
                    return acc;
                }, {});

                const enrichedSatisfactions = satisfactions.map(satisfaction => {
                    const user = userMap[satisfaction.userId];
                    const emp = user ? empMap[user.empId] : null;

                    // Replace featureLike and improved values with their descriptions
                    const featureLikeDescriptions = satisfaction.featureLike.map(item => featureMap[item]);
                    const improvedDescriptions = satisfaction.improved.map(item => featureMap[item]);

                    return {
                        ...satisfaction.toObject(),
                        user,
                        emp,
                        featureLike: featureLikeDescriptions,
                        improved: improvedDescriptions
                    };
                });

                res.status(200).json({ success: true, data: enrichedSatisfactions });
            } catch (error) {
                console.error("Error fetching satisfactions:", error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            try {
                const satisfaction = await Satisfaction.create(req.body);
                res.status(201).json({ success: true, data: satisfaction });
            } catch (error) {
                console.error("Error creating satisfaction:", error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(405).json({ success: false, message: "Method not allowed" });
            break;
    }
}
