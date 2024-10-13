import { useEffect, useRef } from 'react';
import ProgressBar from 'progressbar.js';

const GenLineProgressBar = ({ percent }) => {
    const progressBarRef = useRef(null);

    useEffect(() => {
        let bar = null;

        if (progressBarRef.current) {
            bar = new ProgressBar.Line(progressBarRef.current, {
                strokeWidth: 5,
                easing: 'easeInOut',
                duration: 1400,
                color: '#F68B1F',
                trailColor: '#eee',
                trailWidth: 10,
                from: { color: '#F68B1F' },
                to: { color: '#F68B1F' },
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
        <div ref={progressBarRef} style={{ position: 'relative', width: '100%', height: '10px' }}></div>
    );
};

export default GenLineProgressBar;
