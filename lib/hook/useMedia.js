import { upload } from '@vercel/blob/client';
import { nanoid } from 'nanoid';
import axios from 'axios';

const useMedia = () => {
    // Add media file
    const add = async (file, userId, folder, subfolder) => {
        try {
            const newBlob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/blob/upload',
            });

            const mediaEntry = {
                url: newBlob.url,
                public_id: nanoid(10),
                file_name: file.name,
                mime_type: file.type,
                file_size: file.size,
                type: file.type.startsWith('image') ? 'image' : 'video',
                userId, // Link to the user
                folder, // Use provided folder
                subfolder: subfolder ? subfolder : '', // Use provided subfolder
            };

            // Save media to the database
            await axios.post('/api/upload/save', mediaEntry);

            // Return the required values
            return {
                public_id: mediaEntry.public_id,
                url: mediaEntry.url,
                type: mediaEntry.type,
            };
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    // Delete media file
    const deleteMedia = async (mediaId) => {
        try {
            // Call API to delete media from the database
            await axios.delete(`/api/upload/delete/${mediaId}`);

            // Optionally return the deleted media ID
            return { publicId: mediaId };
        } catch (error) {
            console.error('Error deleting media:', error);
            throw error;
        }
    };

    return {
        add,
        delete: deleteMedia,
    };
};

export default useMedia;
