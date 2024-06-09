import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';

const RedeemDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [redeem, setRedeem] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [userCoins, setUserCoins] = useState(0);

  useEffect(() => {
    if (id) {
      fetchRedeem();
      fetchUserData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRedeem = async () => {
    const res = await axios.get(`/api/redeem?id=${id}`);
    setRedeem(res.data.data);
  };

  const fetchUserData = async () => {
    const session = await getSession();
    if (session) {
      const pointsRes = await axios.get(`/api/points?userId=${session.user.id}`);
      const coinsRes = await axios.get(`/api/coins?userId=${session.user.id}`);
      setUserPoints(pointsRes.data.point);
      setUserCoins(coinsRes.data.coins);
    }
  };

  const handleRedeem = async () => {
    const session = await getSession();
    if (!session) {
      alert('Please log in to redeem.');
      return;
    }

    if (userPoints < redeem.point || userCoins < redeem.coins) {
      alert('Insufficient points or coins.');
      return;
    }

    await axios.post('/api/redeemtrans', { redeemId: id, userId: session.user.id });
    alert('Redeemed successfully!');
    router.push('/redeem');
  };

  if (!redeem) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{redeem.name}</h1>
      <p>{redeem.description}</p>
      <Image src={redeem.image} alt={redeem.name} width={200} height={200}/>
      <p>Stock: {redeem.stock}</p>
      <p>Expire: {new Date(redeem.expire).toLocaleDateString()}</p>
      <p>Coins: {redeem.coins}</p>
      <p>Points: {redeem.point}</p>
      <button onClick={handleRedeem}>Redeem</button>
    </div>
  );
};

export default RedeemDetailPage;