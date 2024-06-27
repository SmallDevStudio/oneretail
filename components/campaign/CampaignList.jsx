import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const response = await axios.get('/api/campaign');
    const activeCampaigns = response.data.data.filter((campaign) => campaign.isActive);
    setCampaigns(activeCampaigns);
  };

  return (
    <div>
      <h1>Campaigns</h1>
      <div>
        {campaigns.map((campaign) => (
          <div key={campaign._id}>
            <Image src={campaign.image} alt={campaign.title} width={300} height={300} style={{objectFit: 'cover', objectPosition: 'center', height: 'auto', width: 'auto'}}/>
            <h2>{campaign.title}</h2>
            <Link href={`/campaign/${campaign._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignPage;