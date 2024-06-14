import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';

const RedeemQrPage = () => {
    const router = useRouter();
    const { transactionId, userId } = router.query;
  
    useEffect(() => {
      if (transactionId && userId) {
        handleRedeem(transactionId, userId);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionId, userId]);
  
    const handleRedeem = async (transactionId, userId) => {
      try {
        console.log('Redeeming - transactionId:', transactionId, 'userId:', userId);
  
        const response = await axios.put('/api/qrcode', {
          transactionId,
          userId,
        });
  
        if (response.data.success) {
          Swal.fire('Success', 'Points and Coins redeemed successfully!', 'success');
          router.push('/profile');
        } else {
          Swal.fire('Error', response.data.message || 'Failed to redeem points and coins.', 'error');
        }
      } catch (error) {
        console.error('Error redeeming QR Code:', error.response?.data || error.message);
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