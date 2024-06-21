import { useEffect, useRef } from 'react';
import ProgressBar from 'progressbar.js';

const VoteLineProgressBar = ({ percent, color }) => {
    const progressBarRef = useRef(null);

    useEffect(() => {
        if (progressBarRef.current) {
            const bar = new ProgressBar.Line(progressBarRef.current, {
                strokeWidth: 5,
                easing: 'easeInOut',
                duration: 1400,
                color: color,
                trailColor: '#eee',
                trailWidth: 5,
                svgStyle: {width: '100%', height: '100%', position: 'relative'},
                text: {
                    style: {
                        color: '#000',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        padding: 0,
                        margin: 0,
                        transform: {
                            prefix: true,
                            value: 'translate(-50%, -50%)'
                        }, // Center the text
                        fontSize: '16px'
                    },
                    autoStyleContainer: false
                },
                from: { color: color },
                to: { color: color },
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
    }, [percent, color]);

    return (
        <div ref={progressBarRef}></div>
    );
};

export default VoteLineProgressBar;
