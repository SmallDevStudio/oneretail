import mongoose from 'mongoose';
import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
import Emp from "@/database/models/emp";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    await connectMongoDB();

    const { method, query } = req;
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear(), department = '' } = query;

    switch (method) {
        case 'GET':
            try {
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 0, 23, 59, 59); // End of the month

                const empFilter = department ? { department } : {};

                // Aggregate surveys to count how many userId gave each score in each week
                const surveys = await Survey.aggregate([
                    {
                        $match: {
                            createdAt: { $gte: startDate, $lte: endDate }
                        }
                    },
                    {
                        $project: {
                            week: { $week: "$createdAt" },
                            value: 1,
                            userId: 1
                        }
                    },
                    {
                        $group: {
                            _id: { week: "$week", value: "$value" },
                            count: { $sum: 1 },
                            userIds: { $push: "$userId" }
                        }
                    },
                    {
                        $sort: { "_id.week": 1, "_id.value": 1 }
                    }
                ]);

                // Fetch user details for all userIds in the surveys
                const allUserIds = surveys.reduce((acc, s) => acc.concat(s.userIds), []);
                const uniqueUserIds = [...new Set(allUserIds)];

                const users = await Users.find({ userId: { $in: uniqueUserIds } }).select('userId empId fullname pictureUrl');
                const empIds = users.map(user => user.empId);
                const emps = await Emp.find({ empId: { $in: empIds }, ...empFilter }).select('empId department teamGrop');

                const empMap = emps.reduce((acc, emp) => {
                    acc[emp.empId] = emp;
                    return acc;
                }, {});

                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = {
                        userId: user.userId,
                        empId: user.empId,
                        fullname: user.fullname,
                        pictureUrl: user.pictureUrl,
                        teamGrop: empMap[user.empId]?.teamGrop || 'Unknown',
                        department: empMap[user.empId]?.department || 'Unknown'
                    };
                    return acc;
                }, {});

                // Convert to a structure more easily consumable by the frontend
                const surveyData = surveys.reduce((acc, s) => {
                    const week = s._id.week;
                    const value = s._id.value;

                    if (!acc[week]) {
                        acc[week] = {};
                    }

                    acc[week][value] = {
                        count: s.count,
                        empDetails: s.userIds.map(userId => userMap[userId] || { userId: "Unknown", empId: "Unknown", fullname: "Unknown", pictureUrl: "" })
                    };

                    return acc;
                }, {});

                return res.status(200).json({ data: surveyData });

            } catch (error) {
                return res.status(400).json({ error: error.message });
            }

        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}
