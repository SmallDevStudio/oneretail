import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { AppLayout } from '@/themes';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const VoteLineProgressBar = dynamic(() => import('@/components/VoteLineProgressBar'), { ssr: false });

const VotePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data: session } = useSession();
    const [topic, setTopic] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [votes, setVotes] = useState([]);
    const [voteCounts, setVoteCounts] = useState({});
    const [userVote, setUserVote] = useState(null);

    useEffect(() => {
        if (id) {
            fetchTopic();
            fetchVotes();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchTopic = async () => {
        try {
            const res = await axios.get(`/api/topics/${id}`);
            setTopic(res.data.data);
        } catch (error) {
            console.error("Error fetching topic:", error);
        }
    };

    const fetchVotes = async () => {
        try {
            const res = await axios.get(`/api/votes?topicId=${id}`);
            setVotes(res.data.data);
            calculateVoteCounts(res.data.data, res.data.topic.options);

            const userVote = res.data.data.find(vote => vote.userId === session.user.id);
            if (userVote) {
                setSelectedOption(userVote.optionId);
                setUserVote(userVote);
            }
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
    };

    const calculateVoteCounts = (votes, options) => {
        const counts = options.reduce((acc, option) => {
            acc[option._id] = 0;
            return acc;
        }, {});

        votes.forEach(vote => {
            counts[vote.optionId] += 1;
        });

        setVoteCounts(counts);
    };

    const handleVote = async () => {
        if (!selectedOption) return;

        console.log("Selected option:", selectedOption);
        console.log("User:", session.user.id);
        console.log("Topic:", id);

        try {
            if (userVote) {
                // Update existing vote
                const response = await axios.put(`/api/votes/${userVote._id}`, {
                    optionId: selectedOption
                });
                console.log("Update vote response:", response.data);
            } else {
                // Create new vote
                const response = await axios.post('/api/votes', {
                    topicId: id,
                    userId: session.user.id,
                    optionId: selectedOption
                });
                console.log("Vote response:", response.data);
            }
            fetchVotes();
        } catch (error) {
            console.error("Error submitting vote:", error);
        }
    };

    const totalVotes = votes.length;
    const colors = ['#F68B1F', '#F6C71F', '#1FF6A3', '#1F5FF6', '#F61F5E'];

    return (
        <div className="flex flex-col p-5 w-full">
            {topic ? (
                <>
                    <h1 className="text-2xl font-bold mb-2 text-[#0056FF]">{topic.title}</h1>
                    <p className="mb-2">{topic.description}</p>
                    <ul className="mb-2">
                        {topic.options.map((option, index) => (
                            <li key={option._id} className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    name="vote"
                                    value={option._id}
                                    checked={selectedOption === option._id}
                                    onChange={() => setSelectedOption(option._id)}
                                    className="ml-2 mr-2"
                                />
                                {option.type === 'text' && <span>{option.value}</span>}
                                {option.type === 'image' && <Image src={option.value} alt="option" width={50} height={50} />}
                                {option.type === 'user' && <span>User: {option.value}</span>}
                                {option.type === 'content' && <span>Content: {option.value}</span>}
                            </li>
                        ))}
                    </ul>
                    <button 
                    onClick={handleVote}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2"
                    >
                        {userVote ? "Update Vote" : "Vote"}
                    </button>
                </>
            ) : (
                <p>Loading topic...</p>
            )}
            <div className='mt-10 p-5'>
                <h2 className="text-2xl font-bold mb-2 text-[#0056FF]">Results</h2>
                {topic && (
                    <ul>
                        {topic.options.map((option, index) => {
                            const count = voteCounts[option._id] || 0;
                            const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
                            return (
                                <li key={option._id}>
                                    {option.type === 'text' && <span>{option.value}</span>}
                                    {option.type === 'image' && <Image src={option.value} alt="option" width={50} height={50} />}
                                    {option.type === 'user' && <span>User: {option.value}</span>}
                                    {option.type === 'content' && <span>Content: {option.value}</span>}
                                    <div className="relative">
                                    <VoteLineProgressBar percent={percentage} color={colors[index % colors.length]} />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

VotePage.getLayout = function getLayout(page) {
    return <AppLayout>{page}</AppLayout>;
};

VotePage.auth = true;

export default VotePage;
