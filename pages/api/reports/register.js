import connectMongoDB from "@/lib/services/database/mongodb";
import Users from "@/database/models/users";
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

export default async function handler(req, res) {
    await connectMongoDB();
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                let users = await Users.find({}).sort({ createdAt: -1 });

                // Group users by month and year
                const groupedData = users.reduce((acc, user) => {
                    const monthYear = moment(user.createdAt).format('MMMM YYYY');
                    const monthYearThai = `เดือน ${monthYear}`;

                    if (!acc[monthYearThai]) {
                        acc[monthYearThai] = [];
                    }

                    acc[monthYearThai].push({
                        empId: user.empId,
                        fullname: user.fullname,
                        userId: user.userId,
                        createdAt: user.createdAt,
                    });

                    return acc;
                }, {});

                res.status(200).json({ success: true, data: groupedData });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}
