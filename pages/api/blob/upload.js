import { handleUpload } from '@vercel/blob/client';

export default async function handler(request, response) {
  const body = request.body;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
        // Generate a client token for the browser to upload the file
        const token = process.env.OneRetail_READ_WRITE_TOKEN; // ใช้ Environment Variable

        if (!token) {
          throw new Error('Missing Vercel Blob token');
        }

        return {
          allowedContentTypes: [
            'image/jpeg', 
            'image/jpg', 
            'image/png', 
            'image/gif',
            'image/webp',
            'image/svg',
            'video/mp4',
            'video/webm',
            'video/ogg',
            'video/quicktime',
            'video/mov',
          ],
          tokenPayload: JSON.stringify({
            token,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Logic หลังจากอัปโหลดเสร็จสิ้น
        console.log('blob upload completed', blob, tokenPayload);

        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    // The webhook will retry 5 times waiting for a 200
    return response.status(400).json({ error: 'Could not upload file' });
  }
}
