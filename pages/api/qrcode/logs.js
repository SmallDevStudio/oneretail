import connectMongoDB from '@/lib/services/database/mongodb';
import QRCodeTransaction from '@/database/models/QRCodeTransaction';
import Users from '@/database/models/users';
import moment from 'moment';
import 'moment/locale/th';

export default async function handler(req, res) {
  await connectMongoDB();

  switch (req.method) {
    case 'GET':
      try {
        const logs = await QRCodeTransaction.find({});
        const users = await Users.find({});

        const userMap = users.reduce((map, user) => {
          map[user.userId] = user;
          return map;
        }, {});

        const logsWithUserInfo = logs.map(log => {
          const scannedUsers = log.scannedBy.map(userId => userMap[userId]).filter(Boolean);
          const userDetailsString = scannedUsers.map((user, index) => (
            `Name: ${user.fullname || ''}, empId: ${user.empId || ''}, Team: ${user.teamGrop || ''}, Scanned At: ${moment(log.scannedAt[index]).format('DD/MM/YYYY HH:mm')}`
          )).join('; ');
          return {
            ...log._doc,
            fullname: userMap[log.userId]?.fullname || '',
            empId: userMap[log.userId]?.empId || '',
            teamGrop: userMap[log.userId]?.teamGrop || '',
            hasUser: scannedUsers.length > 0 ? 'Yes' : 'No',
            userDetails: userDetailsString,
            createdAt: moment(log.createdAt).format('DD/MM/YYYY HH:mm')
          };
        });

        res.status(200).json({ success: true, data: logsWithUserInfo });
      } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
