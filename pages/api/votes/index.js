import connetMongoDB from "@/lib/services/database/mongodb";
import Vote from "@/database/models/Vote";
import Users from "@/database/models/users";
import Topic from "@/database/models/Topic";

export default async function handler(req, res) {
    const { method } = req;

    await connetMongoDB();

    switch (method) {
        case 'GET':
            try {
                const { topicId } = req.query;
                if (!topicId) {
                    return res.status(400).json({ success: false, message: 'Topic ID is required' });
                }
                const votes = await Vote.find({ topicId });
                const userIds = votes.map(vote => vote.userId);
                const users = await Users.find({ userId: { $in: userIds } });

                const topic = await Topic.findById(topicId);

                const votesWithUserDetails = votes.map(vote => {
                    const user = users.find(user => user.userId === vote.userId);
                    const option = topic.options.find(option => option._id.toString() === vote.optionId.toString());
                    let optionDisplay = option.value;

                    if (option.type === 'user') {
                        const optionUser = Users.findOne({ userId: option.value });
                        optionDisplay = optionUser ? optionUser.pictureUrl : 'Unknown User';
                    }

                    return {
                        ...vote._doc,
                        user: {
                            fullname: user.fullname,
                            pictureUrl: user.pictureUrl
                        },
                        option: {
                            type: option.type,
                            value: optionDisplay
                        }
                    };
                });

                res.status(200).json({ success: true, data: votesWithUserDetails, topic });
            } catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
            break;
        case 'POST':
            try {
                const { userId, topicId, optionId } = req.body;
                console.log({ userId, topicId, optionId });
                if (!userId || !topicId || !optionId) {
                    return res.status(400).json({ success: false, message: 'User ID, Topic ID, and Option ID are required' });
                }

                const existingVote = await Vote.findOne({ userId, topicId });
                console.log({ existingVote });

                if (existingVote) {
                    return res.status(400).json({ success: false, message: 'User has already voted' });
                }

                const vote = await Vote.create(req.body);
                res.status(201).json({ success: true, data: vote });
            } catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
            break;
        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
};