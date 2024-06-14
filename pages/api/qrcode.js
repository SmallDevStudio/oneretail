// components/ScanQRCode.jsx
import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-reader';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';

const ScanQRCode = () => {
  const { data: session } = useSession(); // Get the current session
  const [scannedData, setScannedData] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then((deviceInfos) => {
        const videoDevices = deviceInfos.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      })
      .catch(error => console.error('Error fetching video devices:', error));
  }, []);

  const handleScan = async (data) => {
    if (data) {
      console.log("Scanned Data:", data);
      setScannedData(data);
      const userId = session?.user?.id; // Get the userId of the scanning user

      try {
        const response = await axios.put('/api/qrcode', {
          transactionId: JSON.parse(data.text).transactionId,
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
    console.error("Error:", err);
    Swal.fire('Error', 'Error scanning QR Code.', 'error');
  };

  const previewStyle = {
    height: 240,
    width: '100%',
  };

  const handleDeviceChange = (event) => {
    console.log("Device changed to:", event.target.value);
    setSelectedDeviceId(event.target.value);
  };

  return (
    <div>
      <h2>Scan QR Code</h2>
      <div>
        <label htmlFor="deviceSelect">Select Camera:</label>
        <select id="deviceSelect" onChange={handleDeviceChange} value={selectedDeviceId}>
          {devices.map((device, index) => (
            <option key={index} value={device.deviceId}>
              {device.label || `Camera ${index + 1}`}
            </option>
          ))}
        </select>
      </div>
      <QrReader
        delay={300}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
        constraints={{
          video: {
            deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          },
        }}
      />
      {scannedData && <pre>{JSON.stringify(scannedData, null, 2)}</pre>}
    </div>
  );
};

export default ScanQRCode;
