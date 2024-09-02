import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const SCEditor = dynamic(() => import('sceditor').then(mod => mod.default), { ssr: false });

const CampaignDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCampaign = async () => {
    const response = await axios.get(`/api/campaign/${id}`);
    setCampaign(response.data.data);
  };

  if (!campaign) return <div>Loading...</div>;

  return (
    <div>
      <h1>{campaign.title}</h1>
      <Image 
        src={campaign.image} 
        alt={campaign.title} 
        width={300} height={300} 
        style={{
          objectFit: 'cover', 
          objectPosition: 'center', 
          height: 'auto', 
          width: 'auto'}}
        />
      <div dangerouslySetInnerHTML={{ __html: campaign.description }}></div>
    </div>
  );
};

export default CampaignDetailPage;