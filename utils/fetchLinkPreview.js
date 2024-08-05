import axios from 'axios';

const fetchLinkPreview = async (url) => {
  try {
    const response = await axios.get(`https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=fabeb4bc-ba15-414f-9779-eb9df8a6c256`);
    return response.data;
  } catch (error) {
    console.error('Error fetching link preview:', error);
    return null;
  }
};

export default fetchLinkPreview;