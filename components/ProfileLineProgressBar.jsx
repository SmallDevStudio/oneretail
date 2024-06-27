import { useEffect, useRef } from 'react';
import ProgressBar from 'progressbar.js';

const ProfileLineProgressBar = ({ percent }) => {
    const progressBarRef = useRef(null);

    useEffect(() => {
        let bar = null;

        if (progressBarRef.current) {
            bar = new ProgressBar.Line(progressBarRef.current, {
                strokeWidth: 10,
                easing: 'easeInOut',
                duration: 1400,
                color: '#F68B1F',
                trailColor: '#eee',
                trailWidth: 10,
                svgStyle: { width: '100%', height: '100%' },
                text: {
                    style: {
                        color: '#fff',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        padding: 0,
                        margin: 0,
                        transform: 'translate(-50%, -50%)', // Center the text
                        fontSize: '14px',
                        lineHeight: '14px', // Add this line to ensure Safari handles the text size correctly
                    },
                    autoStyleContainer: false
                },
                from: { color: '#F68B1F' },
                to: { color: '#F68B1F' },
                step: (state, bar) => {
                    bar.path.setAttribute('stroke-linecap', 'round');
                    bar.setText(Math.round(bar.value() * 100) + ' %');
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
        <div ref={progressBarRef} style={{ position: 'relative', width: '100%', height: '10px' }}></div>
    );
};

export default ProfileLineProgressBar;
