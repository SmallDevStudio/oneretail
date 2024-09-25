import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
import Emp from "@/database/models/emp";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            const { startDate, endDate, teamGrop } = req.query;

            if (!startDate || !endDate || !teamGrop) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required query parameters: startDate, endDate, teamGrop"
                });
            }

            try {
                // Fetch all surveys in the given date range
                const surveys = await Survey.find({
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(new Date(endDate).setHours(23, 59, 59)),
                    }
                });

                const userIds = surveys.map(survey => survey.userId);
                const users = await Users.find({ userId: { $in: userIds } }).select('userId empId');

                const empIds = users.map(user => user.empId);
                const emps = await Emp.find({ empId: { $in: empIds } }).lean();

                // Create a mapping of empId to employee data
                const empMap = emps.reduce((acc, emp) => {
                    if (!emp.teamGrop) {
                        console.log("Missing teamGrop for emp:", emp.empId);  // Log missing teamGrop for empId
                    }
                    acc[emp.empId] = emp;
                    return acc;
                }, {});

                // Create a mapping of userId to combined user and employee data
                const userMap = users.reduce((acc, user) => {
                    const empData = empMap[user.empId];
                    acc[user.userId] = {
                        userId: user.userId,
                        empId: user.empId,
                        fullname: empData?.fullname || user.fullname,
                        pictureUrl: user.pictureUrl,
                        teamGrop: empData?.teamGrop || 'Unknown',
                        department: empData?.department || 'Unknown',
                        position: empData?.position || 'Unknown',
                        branch: empData?.branch || 'Unknown',
                        group: empData?.group || 'Unknown',
                        chief_th: empData?.chief_th || 'Unknown'  // Add chief_th
                    };
                    return acc;
                }, {});

                // Filter data by teamGrop
                const filteredData = surveys.filter(survey => {
                    const user = userMap[survey.userId];
                    return user?.teamGrop?.toLowerCase() === teamGrop.toLowerCase();
                });

                // Aggregate by chief_th and calculate counts, total, sum, and average
                const chiefData = filteredData.reduce((acc, survey) => {
                    const userChief = userMap[survey.userId]?.chief_th;
                    if (!userChief) return acc;

                    if (!acc[userChief]) {
                        acc[userChief] = { chief_th: userChief, counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, total: 0, sum: 0, average: 0 };
                    }

                    acc[userChief].counts[survey.value]++;
                    acc[userChief].total++;
                    acc[userChief].sum += survey.value; // Sum up the values for average calculation
                    return acc;
                }, {});

                // Calculate the average for each chief and convert the object into an array
                const chiefDataArray = Object.values(chiefData).map(chief => {
                    chief.average = chief.total > 0 ? Math.round(chief.sum / chief.total) : 0;
                    return chief;
                });

                // Sort by chief name (alphabetically)
                chiefDataArray.sort((a, b) => a.chief_th.localeCompare(b.chief_th));

                res.status(200).json({ success: true, data: chiefDataArray });
            } catch (error) {
                console.error("Error fetching surveys:", error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(405).json({ success: false, error: "Method not allowed" });
            break;
    }
}
