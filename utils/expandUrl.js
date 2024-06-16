import axios from 'axios';

const expandUrl = async (shortUrl) => {
  try {
    const response = await axios.get(`https://unshorten.me/json/${shortUrl}`);
    if (response.data && response.data.resolved_url) {
      return response.data.resolved_url;
    }
    return shortUrl;
  } catch (error) {
    console.error('Error expanding URL:', error);
    return shortUrl;
  }
};

export default expandUrl;
