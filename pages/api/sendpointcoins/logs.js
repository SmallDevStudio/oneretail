import connectMongoDB from '@/lib/services/database/mongodb';
import SentPointCoins from '@/database/models/SentPointCoins';
import Users from '@/database/models/users';
import moment from 'moment';
import 'moment/locale/th';

export default async function handler(req, res) {
  await connectMongoDB();

  switch (req.method) {
    case 'GET':
      try {
        const logs = await SentPointCoins.find({});
        const users = await Users.find({});

        const userMap = users.reduce((map, user) => {
          map[user.userId] = user;
          return map;
        }, {});

        const logsWithUserInfo = logs.map(log => {
          return {
            ...log._doc,
            fullname: userMap[log.userId]?.fullname || '',
            empId: userMap[log.userId]?.empId || '',
            teamGrop: userMap[log.userId]?.teamGrop || '',
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
