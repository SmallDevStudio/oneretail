// components/ScanQRCode.jsx
import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const ScanQRCode = () => {
  const { data: session } = useSession(); // Get the current session
  const [scannedData, setScannedData] = useState(null);
  const router = useRouter();

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
        router.push('/profile');
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
    <div className="flex flex-col text-center items-center justify-center mt-10">
      <h2 className="text-3xl font-bold mb-4 text-[#0056FF]">Scan QR Code</h2>
      <QrScanner
        delay={300}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
        className="w-full h-full"
      />
      {scannedData && <p>Data: {scannedData}</p>}
    </div>
  );
};

export default ScanQRCode;
