// components/ZXingScanner.jsx
import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ZXingScanner = () => {
  const { data: session } = useSession(); // Get the current session
  const [scannedData, setScannedData] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const videoRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const codeReader = new BrowserMultiFormatReader();

  useEffect(() => {
    codeReader.listVideoInputDevices()
      .then((videoInputDevices) => {
        setDevices(videoInputDevices);
        if (videoInputDevices.length > 0) {
          setSelectedDeviceId(videoInputDevices[0].deviceId);
        }
      })
      .catch(err => console.error('Error listing video devices:', err));
  }, [codeReader]);

  useEffect(() => {
    if (selectedDeviceId) {
      codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
        if (result) {
          handleScan(result.getText());
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error('Error decoding QR Code:', err);
        }
      });
    }
    return () => {
      codeReader.reset();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceId, codeReader]);

  const handleScan = async (data) => {
    if (data) {
      console.log("Scanned Data:", data);
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
      <video ref={videoRef} style={{ width: '100%' }} />
      {scannedData && <pre>{JSON.stringify(scannedData, null, 2)}</pre>}
    </div>
  );
};

export default ZXingScanner;
