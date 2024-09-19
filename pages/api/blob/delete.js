import { del } from '@vercel/blob';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const { url } = req.query; // ดึงค่า URL จาก query string

        if (!url) {
            return res.status(400).json({ error: 'URL is required to delete a blob' });
        }

        try {
            // ลบไฟล์โดยใช้ del() และส่ง URL ของไฟล์ที่ต้องการลบ
            await del(url, {
                onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
                    // Generate a client token for the browser to upload the file
                    const token = process.env.OneRetail_READ_WRITE_TOKEN; // ใช้ Environment Variable
            
                    if (!token) {
                      throw new Error('Missing Vercel Blob token');
                    }
            
                    return {
                      tokenPayload: JSON.stringify({
                        token,
                      }),
                    };
                  },
            });

            res.status(200).json({ message: `File ${url} deleted successfully` });
        } catch (error) {
            console.error('Error deleting blob:', error);
            res.status(500).json({ error: 'Error deleting blob' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
