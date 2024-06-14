import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import axios from 'axios';
import Swal from 'sweetalert2';

const ScanQRCode = () => {
  const [scannedData, setScannedData] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      setScannedData(data);
      const userId = 'scanningUserId'; // Replace with the actual userId

      try {
        const response = await axios.put('/api/qrcode', {
          transactionId: JSON.parse(data).transactionId,
          userId,
        });

        Swal.fire('Success', 'QR Code scanned successfully!', 'success');
      } catch (error) {
        console.error('Error scanning QR Code:', error);
        Swal.fire('Error', 'Error scanning QR Code.', 'error');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    Swal.fire('Error', 'Error scanning QR Code.', 'error');
  };

  return (
    <div>
      <h2>Scan QR Code</h2>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      {scannedData && <p>Data: {scannedData}</p>}
    </div>
  );
};

export default ScanQRCode;