import connectMongoDB from "@/lib/services/database/mongodb";
import Survey from "@/database/models/Survey";
import Emp from "@/database/models/emp";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case "GET":
            const { startDate, endDate, teamGrop, group } = req.query;

            if (!startDate || !endDate || !teamGrop || !group) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required query parameters: startDate, endDate, teamGrop, department"
                });
            }

            try {
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

                const empMap = emps.reduce((acc, emp) => {
                    if (!emp.teamGrop) {
                        console.log("Missing teamGrop for emp:", emp.empId);  // Log missing teamGrop for empId
                    }
                    acc[emp.empId] = emp;
                    return acc;
                }, {});
                
                const userMap = users.reduce((acc, user) => {
                    const empData = empMap[user.empId];
                    acc[user.userId] = {
                        userId: user.userId,
                        empId: user.empId,
                        fullname: user.fullname,
                        pictureUrl: user.pictureUrl,
                        teamGrop: empData?.teamGrop || 'Unknown',
                        department: empData?.department || 'Unknown',
                        position: empData?.position || 'Unknown',
                        branch: empData?.branch || 'Unknown',
                        group: empData?.group || 'Unknown',
                    };
                    
                    return acc;
                }, {});

                // Filter data by teamGrop, group, and department
                const filteredData = surveys.filter(survey => {
                    const user = userMap[survey.userId];
                    return (
                        user?.teamGrop?.toLowerCase() === teamGrop.toLowerCase() &&
                        user?.group?.toLowerCase() === group?.toLowerCase()
                    );
                });

                // Aggregate by department and count values
                const departmentData = filteredData.reduce((acc, survey) => {
                    const userDepartment = userMap[survey.userId]?.department;
                    if (!userDepartment) return acc;

                    if (!acc[userDepartment]) {
                        acc[userDepartment] = { 
                            department: userDepartment, 
                            counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, 
                            total: 0, 
                            sum: 0,
                            memoCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                        };
                    }

                    acc[userDepartment].counts[survey.value]++;
                    acc[userDepartment].total++;
                    acc[userDepartment].sum += survey.value;

                    // Update memoCount
                    if (survey.memo && survey.memo.trim() !== "") {
                        acc[userDepartment].memoCount[survey.value]++;
                    }
                    return acc;
                }, {});

                // Calculate the average for each department and convert the object into an array
                const departmentDataArray = Object.values(departmentData).map(department => {
                    // Use Math.round to round the average to the nearest whole number
                    department.average = department.total > 0 ? Math.round(department.sum / department.total) : 0;
                    return department;
                });

                // Sort by average (descending order)
                departmentDataArray.sort((a, b) => b.average - a.average);

                res.status(200).json({ success: true, data: departmentDataArray });
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
