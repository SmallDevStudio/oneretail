import mongoose from 'mongoose';
import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";

export default async function handler(req, res) {
    await connectMongoDB();

    const { method, query } = req;
    const { months = 1, limit = 10, page = 1, teamGrop = '' } = query;

    switch (method) {
        case 'GET':
            try {
                const endDate = new Date();
                const startDate = new Date(new Date().setMonth(endDate.getMonth() - months));
                const limitNumber = parseInt(limit);
                const pageNumber = parseInt(page);

                // Fetch employees based on teamGrop filter
                const empFilter = teamGrop ? { teamGrop } : {};
                const emps = await Emp.find(empFilter).select('empId');
                const empIds = emps.map(emp => emp.empId);

                // Fetch users based on empIds
                const users = await Users.find({ empId: { $in: empIds } }).select('userId empId fullname pictureUrl');
                const userIds = users.map(user => user.userId);

                // Fetch surveys within the date range and filtered by userIds
                const surveys = await Survey.find({
                    userId: { $in: userIds },
                    createdAt: { $gte: startDate, $lte: endDate }
                }).sort({ createdAt: -1 })
                  .skip((pageNumber - 1) * limitNumber)
                  .limit(limitNumber);

                if (surveys.length === 0) {
                    return res.status(404).json({ error: 'No surveys found for the specified period.' });
                }

                const totalSurveys = await Survey.countDocuments({
                    userId: { $in: userIds },
                    createdAt: { $gte: startDate, $lte: endDate }
                });

                const empMap = emps.reduce((acc, emp) => {
                    acc[emp.empId] = emp;
                    return acc;
                }, {});

                const surveysWithUserDetails = surveys.map(survey => {
                    const user = users.find(user => user.userId === survey.userId);
                    return {
                        ...survey._doc,
                        fullname: user ? user.fullname : 'Unknown',
                        empId: user ? user.empId : 'Unknown',
                        pictureUrl: user ? user.pictureUrl : 'Unknown',
                        emp: empMap[user.empId] || null
                    };
                });

                return res.status(200).json({ data: surveysWithUserDetails, total: totalSurveys });

            } catch (error) {
                return res.status(400).json({ error: error.message });
            }

        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}
