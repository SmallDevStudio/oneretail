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
        svgStyle: { strokeLinecap: 'round',
                    strokeWidth: 15,
                    
      },


        text: {
          value: '',
          alignToBottom: false,
          className: "progressbar__label",
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
          bar.text.style.color = state.color;
        },
         
      });
      

      bar.animate(percentage / 100);  // Convert percentage to value between 0.0 to 1.0
    }

    return () => {
      if (bar) bar.destroy();
    };
  }, [percentage]);

  return (
    <div>
      <div ref={containerRef} className='rounded-full '
      style={{
        margin: '0 auto',
      }}
        ></div>
    </div>
  );
};

export default HalfCircleProgressBar;