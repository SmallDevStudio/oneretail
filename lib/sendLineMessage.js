import axios from "axios";

const sendLineMessage = async (userId, message, imagePath) => {
  try {
    // ดึง BASE_URL จาก environment variables
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const payload = {
      to: userId,
      messages: [{ type: "text", text: message }],
    };

    // เพิ่มรูปภาพถ้ามี
    if (imagePath) {
      payload.messages.push({
        type: "image",
        originalContentUrl: `${baseUrl}${imagePath}`, // รวม BASE_URL + path
        previewImageUrl: `${baseUrl}${imagePath}`,
      });
    }

    const response = await axios.post(
      "https://api.line.me/v2/bot/message/push",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LINE_ACCESS_TOKEN}`, // ใช้ Token จาก env
        },
      }
    );

    console.log("✅ LINE Message Sent Successfully:", response.data);
  } catch (error) {
    console.error("❌ Error sending message to LINE:", error);
  }
};
