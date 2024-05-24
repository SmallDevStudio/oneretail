import NextConnect from 'next-connect';
import middleware from '@/services/database/mongodb';

const handler = NextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
    const users = await req.db.collection('users').findOne();
    console.log('users:', users);
    res.status(200).json({ users });
});

export default handler;