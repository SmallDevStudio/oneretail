import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';

const RedeemQrPage = () => {
  const router = useRouter();
  const { transactionId } = router.query;

  useEffect(() => {
    if (transactionId) {
      handleRedeem(transactionId);
    }
  }, [transactionId]);

  const handleRedeem = async (transactionId) => {
    try {
      const userId = session?.user?.id;

      const response = await axios.put('/api/qrcode', {
        transactionId,
        userId,
      });

      if (response.data.success) {
        Swal.fire('Success', 'Points and Coins redeemed successfully!', 'success');
      } else {
        Swal.fire('Error', 'Failed to redeem points and coins.', 'error');
      }
    } catch (error) {
      console.error('Error redeeming QR Code:', error);
      Swal.fire('Error', 'Error redeeming points and coins.', 'error');
    }
  };

  return (
    <div>
      <h1>Redeem Points and Coins</h1>
      <p>Scan the QR code to redeem your points and coins.</p>
    </div>
  );
};

export default RedeemQrPage;