import { useEffect, useRef } from 'react';
import ProgressBar from 'progressbar.js';

const ProfileLineProgressBar = ({ percent }) => {
    const progressBarRef = useRef(null);

    useEffect(() => {
        let bar = null;

        const getColor = (percentage) => {
            if (percentage <= 20) {
              return '#ff0000'; // แดง
            } else if (percentage <= 40) {
              return '#ff8000'; // ส้ม
            } else if (percentage <= 60) {
              return '#ffbf00'; // ส้มอมเหลือง
            } else if (percentage <= 80) {
              return '#80ff00'; // เหลืองอมเขียว
            } else {
              return '#00ff00'; // เขียว
            }
          };

        if (progressBarRef.current) {
            bar = new ProgressBar.Line(progressBarRef.current, {
                strokeWidth: 7,
                easing: 'easeInOut',
                duration: 1400,
                color: '#ED1C24',
                trailColor: '#eee',
                trailWidth: 7,
                from: { color: getColor(0) },
                to: { color: getColor(percent) },
                step: (state, bar) => {
                    bar.path.setAttribute('stroke', getColor(Math.round(bar.value() * 100)));
                    bar.path.setAttribute('stroke-linecap', 'round');
                    const value = Math.round(bar.value() * 100);
                    if (value === 0) {
                      bar.setText('');
                    } else {
                      bar.setText(value + '%');
                    }
                    bar.text.style.color = '#000'; // สีข้อความเป็นสีดำ
                    bar.text.style.fontWeight = 'bold'; // ตัวหนา
                    bar.text.style.top = '50%';
                    bar.text.style.marginTop = '5px';
                    bar.text.style.weight = '25%';
                  },
                svgStyle: {
                    borderRadius: '15px' // Add this line to make the trail rounded
                },
                trail: {
                    borderRadius: '15px' // Add this line to make the trail rounded
                }
            });

            bar.animate(percent / 100); // Value from 0.0 to 1.0
        }

        return () => {
            if (bar) {
                try {
                    bar.destroy();
                } catch (error) {
                    console.error('Error destroying bar:', error);
                }
            }
        };
    }, [percent]);

    return (
        <div 
            ref={progressBarRef} 
            style={{ position: 'flex', width: '100%', height: '8px' }}
        >
        </div>
    );
};

export default ProfileLineProgressBar;
