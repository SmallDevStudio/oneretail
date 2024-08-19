import connectMongoDB from "@/lib/services/database/mongodb";
import Content from "@/database/models/Content";
import Users from "@/database/models/users";
import Emp from "@/database/models/emp";
import ContentViews from "@/database/models/ContentViews";

export default async function handler(req, res) {
    const { method } = req;
    await connectMongoDB();

    switch (method) {
        case 'GET':
            try {
                const { limit, offset, teamGroup } = req.query;
                
                // Get all content views
                const contentViews = await ContentViews.find({}).lean();
                const userIdsWithViews = [...new Set(contentViews.map(view => view.userId))];

                // Query users based on teamGroup and only include users who have content views
                const userQuery = { userId: { $in: userIdsWithViews } };
                if (teamGroup && teamGroup !== 'All') {
                    const empsWithTeamGroup = await Emp.find({ teamGrop: teamGroup }).lean();
                    const teamGroupEmpIds = empsWithTeamGroup.map(emp => emp.empId);
                    userQuery.empId = { $in: teamGroupEmpIds };
                }

                let users = await Users.find(userQuery).lean();

                const empIds = users.map(user => user.empId);

                // Get the related emp data
                const emps = await Emp.find({ empId: { $in: empIds } }).lean();
                const empMap = emps.reduce((acc, emp) => {
                    acc[emp.empId] = emp;
                    return acc;
                }, {});

                const contentIds = contentViews.map(view => view.contentId);

                // Get the related content data and populate related fields
                const contents = await Content.find({ _id: { $in: contentIds } })
                    .populate('categories', 'title')
                    .populate('subcategories', 'title')
                    .populate('groups', 'name')
                    .populate('subgroups', 'name')
                    .lean();

                const contentMap = contents.reduce((acc, content) => {
                    acc[content._id] = content;
                    return acc;
                }, {});


                // Group content views by user
                let userContentViews = users.map(user => {
                    const emp = empMap[user.empId] || {};
                    const userViews = contentViews.filter(view => view.userId === user.userId);

                    const contentViewDetails = userViews.map(view => ({
                        contentId: view.contentId,
                        title: contentMap[view.contentId]?.title || "",
                        categories: contentMap[view.contentId]?.categories?.title || "",
                        subcategories: contentMap[view.contentId]?.subcategories?.title || "",
                        groups: contentMap[view.contentId]?.groups?.name || "",
                        subgroups: contentMap[view.contentId]?.subgroups?.name || "",
                        createdAt: view.createdAt
                    }));

                    return {
                        userId: user.userId,
                        empId: user.empId,
                        fullname: user.fullname,
                        pictureUrl: user.pictureUrl,
                        teamGrop: emp.teamGrop || "",
                        branch: emp.branch || "",
                        department: emp.department || "",
                        group: emp.group || "",
                        position: emp.position || "",
                        views: userViews.length,
                        contentviews: contentViewDetails
                    };
                });

                // Filter out users with zero views
                userContentViews = userContentViews.filter(user => user.views > 0);

                // Sort by number of views (descending)
                userContentViews.sort((a, b) => b.views - a.views);

                // Handle limit and offset
                if (limit === 'Infinity') {
                    userContentViews.forEach((item, index) => {
                        item.rank = index + 1;
                    });
                    res.status(200).json({ success: true, data: userContentViews });
                } else {
                    const numericLimit = parseInt(limit) || 10;
                    const numericOffset = parseInt(offset) || 0;

                    const limitedContentViews = userContentViews.slice(numericOffset, numericOffset + numericLimit);
                    limitedContentViews.forEach((item, index) => {
                        item.rank = numericOffset + index + 1;
                    });
                    res.status(200).json({ success: true, data: limitedContentViews });
                }
                
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}
