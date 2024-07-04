import { useEffect } from 'react';
import 'add-to-homescreen/dist/style/addtohomescreen.css';
import addToHomescreen from 'add-to-homescreen';

const useAddToHomeScreen = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
        addToHomescreen({
        // Configuration options
        maxDisplayCount: 3,
        displayPace: 1440,
        startDelay: 0,
        autostart: true,
      });
    }
  }, []);
};

export default useAddToHomeScreen;
