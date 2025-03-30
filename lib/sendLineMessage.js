import axios from "axios";

const LINE_ACCESS_TOKEN = process.env.LIFF_CHANNEL_ACCESS_TOKEN;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const sendLineMessage = async (userId, message, imagePath) => {
  try {
    // ดึง BASE_URL จาก environment variables
    const payload = {
      to: userId,
      messages: [{ type: "text", text: message }],
    };

    // เพิ่มรูปภาพถ้ามี
    if (imagePath) {
      payload.messages.push({
        type: "image",
        originalContentUrl: `${baseUrl.replace(/\/$/, "")}/${imagePath.replace(
          /^\//,
          ""
        )}`,
        previewImageUrl: `${baseUrl.replace(/\/$/, "")}/${imagePath.replace(
          /^\//,
          ""
        )}`,
      });
    }

    console.log("Sending LINE message:", payload);

    const response = await axios.post(
      "https://api.line.me/v2/bot/message/push",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
        },
      }
    );

    console.log("✅ LINE Message Sent Successfully:", response.data);
  } catch (error) {
    console.error("❌ Error sending message to LINE:", error);
  }
};

export default sendLineMessage;
