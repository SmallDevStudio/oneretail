import { handleUpload } from "@vercel/blob/client";

export const config = {
  api: {
    bodyParser: false, // ปิด bodyParser เพื่อรองรับ FormData
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const formData = await req.formData(); // ✅ รับไฟล์จาก FormData
    const file = formData.get("file");

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const jsonResponse = await handleUpload({
      body: formData,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const token = process.env.OneRetail_READ_WRITE_TOKEN;
        if (!token) throw new Error("Missing Vercel Blob token");

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "video/mp4",
            "video/webm",
          ],
          tokenPayload: { token },
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Upload Completed: ", blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
}
