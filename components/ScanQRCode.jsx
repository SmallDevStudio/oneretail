// components/ScanQRCode.jsx
import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';

const ScanQRCode = () => {
  const { data: session } = useSession(); // Get the current session
  const [scannedData, setScannedData] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      setScannedData(data);
      const userId = session?.user?.id; // Get the userId of the scanning user

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

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div>
      <h2>Scan QR Code</h2>
      <QrScanner
        delay={300}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      {scannedData && <p>Data: {scannedData}</p>}
    </div>
  );
};

export default ScanQRCode;
