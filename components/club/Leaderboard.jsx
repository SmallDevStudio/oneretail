import React, { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import Loading from '@/components/Loading';
import { Tab, Tabs, Avatar } from '@mui/material';
import ClubLeaderBoardModal from '../ClubLeaderBoardModal';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

const fetcher = (url) => fetch(url).then((res) => res.json());

const rewardTypeImages = {
    Ambassador: '/images/club/badge/Ambassador.png',
    Diamond: '/images/club/badge/diamond.png',
    Platinum: '/images/club/badge/Platinum.png',
    Gold: '/images/club/badge/gold.png',
};

const normalizeRewardType = (rewardtype) => {
    if (!rewardtype) return '';
    return rewardtype.charAt(0).toUpperCase() + rewardtype.slice(1).toLowerCase();
};

const LeaderBoard = () => {
    const { data, error } = useSWR('/api/club/leaderboard', fetcher);
    const [selectedType, setSelectedType] = useState("BM");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    if (error) return <div>Failed to load</div>;
    if (!data) return <Loading />;

    const types = ["BM", "CAB", "CYC", "GEN", "GH", "IVS", "LS", "NC", "PB", "RPB", "UC", "WB"];

    const handleTabChange = (event, newValue) => {
        setSelectedType(newValue);
    };

    const onRequestClose = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const filteredData = selectedType === "All" ? data.data : Object.fromEntries(
        Object.entries(data.data).map(([key, value]) => [key, value.filter(item => item.type === selectedType)])
    );

    // Sort the data by rank
    Object.keys(filteredData).forEach(rewardtype => {
        filteredData[rewardtype].sort((a, b) => a.rank - b.rank);
    });

    return (
        <div className='w-full mb-20'>
            <Tabs value={selectedType} 
            onChange={handleTabChange} 
            variant="scrollable" 
            scrollButtons="auto"
            sx={{
                '& .MuiTabs-indicator': {
                    display: 'none',
                },
                '& .Mui-selected': {
                    position: 'relative',
                    color: '#0056FF',
                    fontWeight: 'bold',
                    fontFamily: 'ttb',
                },
                '& .MuiTab-root': {
                    color: '#c0bdbd',
                    fontFamily: 'ttb',
                    textTransform: 'none',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    borderRadius: '15px',
                    backgroundColor: '#414344',
                    marginLeft: '5px',
                    minHeight: '28px',
                    height: '28px',
                    '&.Mui-selected': {
                        color: '#FFF',
                        borderRadius: '15px',
                        backgroundColor: '#0056FF',
                    }, 
                },
            }}
            >
                {types.map((type) => (
                    <Tab key={type} label={type} value={type} sx={{
                        minHeight: '28px',
                        height: '28px',
                    }} />
                ))}
            </Tabs>

            <div className="flex justify-center items-center w-full">
                <span className="text-xl font-bold text-white">
                    อันดับประจำเดือน <span className="text-[#0056FF]">กันยายน</span>
                </span>
            </div>

            {Object.keys(filteredData).map(rewardtype => {
                const normalizedRewardType = normalizeRewardType(rewardtype);
                return filteredData[rewardtype].length > 0 && (
                    <div key={rewardtype}>
                        <div className="flex items-center gap-2 m-2 mt-2">
                            <Image 
                                src={rewardTypeImages[normalizedRewardType]} 
                                alt={normalizedRewardType} 
                                width="40" 
                                height="40"
                                className="mr-2"
                                style={{width: 'auto', height: '40px'}}
                            />
                            <h2 className="text-lg font-bold text-[#0056FF] mt-5">{normalizedRewardType}</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredData[rewardtype].map((item, index) => (
                                <div key={index} className="flex items-center p-2 rounded-full shadow bg-[#414344] cursor-pointer" onClick={() => handleItemClick(item)}>
                                    <span className="font-bold text-white mr-2 text-xl ml-2">{item.rank}</span>
                                    {item.pictureUrl ? (
                                        <Image 
                                            src={item.pictureUrl} 
                                            alt={item.name} 
                                            width="50" 
                                            height="50"
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <Avatar>{item.name[0]}</Avatar>
                                    )}
                                    <div className="ml-3">
                                        <div className="font-bold text-white">{item.empId}</div>
                                        <div className="text-sm text-white">{item.name}</div>
                                    </div>
                                    <div className="ml-auto">
                                        {item.arrow < 0 && <ArrowDownwardIcon style={{ color: 'red' }} className='animate-bounce'/>}
                                        {item.arrow === 0 && <HorizontalRuleIcon style={{ color: 'yellow' }}/>}
                                        {item.arrow > 0 && <ArrowUpwardIcon style={{ color: 'green' }} className='animate-bounce'/>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {selectedItem && (
                <ClubLeaderBoardModal isOpen={modalOpen} onRequestClose={onRequestClose} data={selectedItem} />
            )}
        </div>
    );
}

export default LeaderBoard;
