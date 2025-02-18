import { useCallback } from "react";
import axios from "axios";

const extractFolderId = (url) => {
    const regex = /\/folders\/([a-zA-Z0-9-_]+)/;
    const match = url?.match(regex);
    return match ? match[1] : null;
};

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export const useGoogleDrive = () => {
    const fetchDriveFolderContent = useCallback(async (driveUrl) => {
        const folderId = extractFolderId(driveUrl);
        const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`;
        try {
            const response = await axios.get(url);
            return response.data.files;
        } catch (err) {
            console.error("Error fetching Google Drive folder content:", err);
            return [];
        }
    }, []);

    return { fetchDriveFolderContent };
};