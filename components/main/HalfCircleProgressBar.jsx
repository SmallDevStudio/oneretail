import React, { useEffect, useRef } from 'react';
import ProgressBar from 'progressbar.js';

const HalfCircleProgressBar = ({ percentage }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let bar = null;
    if (typeof window !== 'undefined') {
      bar = new ProgressBar.SemiCircle(containerRef.current, {
        strokeWidth: 12,
        color: '#ffde05',
        trailColor: '#eee',
        trailWidth: 12,
        easing: 'easeInOut',
        duration: 1400,
        svgStyle: {
          strokeLinecap: 'round',
          strokeWidth: 15,
        },
        text: {
          style: {
            color: '#000',
            position: 'absolute',
            left: '50%',
            top: '50%',
            padding: 0,
            margin: 0,
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold',
            fontSize: '3em',
          },
          autoStyleContainer: false,
        },
        from: { color: '#ffde05' },
        to: { color: '#fce803' },
        step: (state, bar) => {
          bar.path.setAttribute('stroke', state.color);
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
          bar.text.style.weight = '25%'; 
        },
      });

      bar.animate(percentage / 100); // Convert percentage to value between 0.0 to 1.0
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
  }, [percentage]);

  

  return (
    <div>
      <div
        ref={containerRef}
        className='rounded-full'
      ></div>
    </div>
  );
};

export default HalfCircleProgressBar;