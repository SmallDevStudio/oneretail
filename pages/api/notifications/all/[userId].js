import connectMongoDB from "@/lib/services/database/mongodb";
import Notification from "@/database/models/Notification";
import Users from "@/database/models/users";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case 'GET':
            const { userId } = req.query;
            try {
                // Fetch notifications
                const notifications = await Notification.find({ userId: userId }).sort({ createdAt: -1 });

                // Extract unique senderIds from the notifications
                const senderIds = notifications.map(notification => notification.senderId);

                // Fetch user details for these senderIds
                const users = await Users.find({ userId: { $in: senderIds } }).select('userId empId pictureUrl fullname');

                // Create a map of senderId to user details
                const userMap = users.reduce((acc, user) => {
                    acc[user.userId] = user;
                    return acc;
                }, {});

                // Append the user details to each notification
                const notificationsWithSenderDetails = notifications.map(notification => ({
                    ...notification._doc, // Spread the original notification data
                    sender: userMap[notification.senderId] || null // Add sender details if available
                }));

                res.status(200).json({ success: true, data: notificationsWithSenderDetails });
            } catch (error) {
                console.error('Error fetching notifications:', error);
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}
