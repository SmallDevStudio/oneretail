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
                const { id } = req.query;
                if (!id) {
                    return res.status(400).json({ success: false, message: 'Topic ID is required' });
                }
                const votes = await Vote.find({ topicId: id });
                const userIds = votes.map(vote => vote.userId);
                const users = await Users.find({ userId: { $in: userIds } });

                const topic = await Topic.findById(id);

                const votesWithUserDetails = votes.map(vote => {
                    const user = users.find(user => user.userId === vote.userId);
                    const option = topic.options.find(option => option._id.toString() === vote.optionId.toString());
                    let optionDisplay = option.value;    // Default option value

                    if (option.type === 'user') {
                        const optionUser = Users.findOne({ userId: option.value });
                        optionDisplay = optionUser ? optionUser.pictureUrl : 'Unknown User';
                    }

                    return {
                        ...vote._doc,
                        user: user ? user : null,
                        title: topic.title,
                        optionDisplay
                    };
                });

                res.status(200).json({ success: true, data: votesWithUserDetails });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}