import { useEffect, useRef } from 'react';
import ProgressBar from 'progressbar.js';

const LineProgressBar = ({ percent }) => {
    const progressBarRef = useRef(null);

    useEffect(() => {
        if (progressBarRef.current) {
            const bar = new ProgressBar.Line(progressBarRef.current, {
                strokeWidth: 5,
                easing: 'easeInOut',
                duration: 1400,
                color: '#F68B1F',
                trailColor: '#eee',
                trailWidth: 5,
                svgStyle: {width: '100%', height: '100%', strokeLinecap: 'round',},
                text: {
                    style: {
                        color: '#fff',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        padding: 0,
                        margin: 0,
                        transform: 'translate(-50%, -50%)', // Center the text
                        fontSize: '16px'
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
                    borderRadius: '15px'  // Add this line to make the trail rounded
                },
                trail: {
                    borderRadius: '15px' // Add this line to make the trail rounded
                }
            });

            bar.animate(percent / 100); // Value from 0.0 to 1.0

            return () => {
                bar.destroy();
            };
        }
    }, [percent]);

    return (
        <div ref={progressBarRef}></div>
    );
};

export default LineProgressBar;