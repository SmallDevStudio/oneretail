import axios from "axios";
import { nanoid } from "nanoid";
import { upload } from "@vercel/blob/client";

/**
 * อัปโหลดไฟล์ไปยัง Blob Storage
 * @param {File} file ไฟล์ที่ต้องการอัปโหลด
 * @param {string} folder โฟลเดอร์ที่จัดเก็บไฟล์
 * @param {string} userId รหัสของผู้ใช้ที่อัปโหลด
 * @param {function} onProgress ฟังก์ชัน callback สำหรับติดตามเปอร์เซ็นต์การอัปโหลด
 * @returns {object|null} ข้อมูลไฟล์ที่อัปโหลด
 */
export const uploadFile = async (file, folder, userId, onProgress) => {
  if (!file) return null;

  try {
    const fileId = nanoid(10);

    // อัปโหลดไฟล์ไปยัง Blob Storage และติดตาม progress
    const newBlob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/blob/upload",
      onProgress: (progress) => {
        if (onProgress) onProgress(progress * 100); // เปลี่ยนเป็นเปอร์เซ็นต์
      },
    });

    if (!newBlob || !newBlob.url) {
      throw new Error("Failed to upload file to Blob Storage.");
    }

    // สร้างข้อมูลไฟล์
    const mediaEntry = {
      url: newBlob.url,
      public_id: fileId,
      file_name: file.name,
      mime_type: file.type,
      file_size: file.size,
      type: file.type.startsWith("image") ? "image" : "video",
      userId,
      folder: folder || "forms",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // บันทึกข้อมูลไฟล์ลงฐานข้อมูลผ่าน API
    await axios.post("/api/upload/save", mediaEntry);

    return mediaEntry;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

/**
 * ลบไฟล์ออกจาก Blob Storage
 * @param {string} fileId รหัสของไฟล์ที่ต้องการลบ
 */
export const deleteFile = async (fileId) => {
  try {
    if (!fileId) {
      console.warn("File ID is required to delete a file.");
      return;
    }

    // ส่งคำขอลบไฟล์ไปยัง API
    const response = await axios.post("/api/blob/delete", { fileId });

    if (response.status === 200) {
      console.log(`File deleted successfully: ${fileId}`);
    } else {
      console.warn(`Failed to delete file: ${fileId}`);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};
