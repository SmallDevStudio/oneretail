// api/club/experiencedelete.js
import connectMongoDB from "@/lib/services/database/mongodb";
import Experience from "@/database/models/Experiences";
import ExperienceComments from "@/database/models/ExperienceComments";
import ExperienceReplyComments from "@/database/models/ExperienceReplyComments";
import Library from "@/database/models/Library";
import LibraryDelete from "@/database/models/LibraryDelete";
import { del } from '@vercel/blob';

export default async function handler(req, res) {
    const { method } = req;

    await connectMongoDB();

    switch (method) {
        case 'DELETE':
            const { experienceId, userId } = req.query;

            try {
                const experience = await Experience.findById(experienceId);

                if (!experience) {
                    return res.status(404).json({ success: false, error: "Experience not found" });
                }

                // ดึง public_id และ url จาก media ของโพสต์
                const mediaToDelete = experience.media.map(item => ({
                    public_id: item.public_id,
                    url: item.url,
                    file_name: item.file_name,
                    type: item.type
                }));

                // ลบไฟล์จาก Vercel Blob
                const deletePromises = mediaToDelete.map(async (media) => {
                    try {
                        await del(media.url, {
                            onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
                                const token = process.env.OneRetail_READ_WRITE_TOKEN; // ใช้ Environment Variable
                                if (!token) throw new Error('Missing Vercel Blob token');

                                return {
                                    tokenPayload: JSON.stringify({ token }),
                                };
                            },
                        });
                    } catch (error) {
                        console.error(`Error deleting blob for URL ${media.url}:`, error);
                    }
                });
                await Promise.all(deletePromises); // รอให้ลบไฟล์ทั้งหมดเสร็จสิ้น

                // ลบข้อมูลใน Library ที่มี public_id ตรงกับโพสต์
                await Library.deleteMany({ public_id: { $in: mediaToDelete.map(media => media.public_id) } });

                // บันทึกข้อมูลการลบลงใน LibraryDelete
                const libraryDelete = new LibraryDelete({
                    delete: [{
                        contentId: postId, 
                        media: mediaToDelete
                    }],
                    userId: userId // ใช้ userId ของผู้ลบโพสต์
                });

                await libraryDelete.save(); // บันทึกข้อมูลการลบ

                // Find and delete all comments related to the experience
                const comments = await ExperienceComments.find({ experienceId });
                const commentIds = comments.map(comment => comment._id);

                // Delete all replies related to the comments
                await ExperienceReplyComments.deleteMany({ commentId: { $in: commentIds } });

                // Delete all comments related to the experience
                await ExperienceComments.deleteMany({ experienceId });

                // Delete the experience itself
                await Experience.findByIdAndDelete(experienceId);

                res.status(200).json({ success: true, data: experience });

            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, error: 'Invalid request method' });
            break;
    }   
}
