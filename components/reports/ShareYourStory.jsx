import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";

moment.locale('th');

const ShareYourStory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/reports/share-your-story');
                setData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleExport = async () => {
        
    };

    return (
        <div className="p-4 bg-white rounded-2xl border-2 shadow-lg text-sm m-4">
            <div className="flex flex-row items-center gap-2">
                <span className="font-bold text-lg">Share Your Story</span>
                <button className="bg-[#0056FF] text-white rounded-2xl p-2 w-1/6 mt-2" 
                    onClick={handleExport}>
                        Export
                </button>
            </div>
        </div>
    );
};

export default ShareYourStory;