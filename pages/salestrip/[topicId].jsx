import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";
import { AppLayout } from "@/themes";
import CircularProgress from '@mui/material/CircularProgress';

const Salestrip = () => {
    const router = useRouter();
    const { topicId } = router.query;
    const { data: session, status } = useSession();
    const [topic, setTopic] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState(null);

    const userId = session?.user?.id;

    const fetchTopic = async () => {
        try {
            const response = await axios.get(`/api/topics/${topicId}`);
            setTopic(response.data.data);
        } catch (error) {
            console.error("Error fetching topic:", error);
        }
    };

    useEffect(() => {
        if (topicId) {
            fetchTopic();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicId]);


    const optionDetails = {
        0: "(หุบเขาเทวดา) - เที่ยวชมความงามหมู่บ้านริมผาสุด Unseen หุบเขาเทวดาวั้งเซียนกู่ หมู่บ้านชนบทที่สวยที่สุดในประเทศจีน",
        1: "(แคชเมียร์) - ดินแดนทางตอนเหนือของประเทศอินเดีย ที่อุดมไปด้วยธรรมชาติอันสวยงาม จยได้รับขนานนามว่าเป็นสรวงสวรรค์บนดิน",
        2: "- ชมวิวแสนล้าน สัมผัสมนต์สเน่ห์แห่งเทือกเขาคอเคซัส สุดขอบทวีปเอเซีย",
        3: "- ปล่อยใจชิล ๆ ไปสัมผัสเกาะในฝัน และความงดงามของธรรมชาติ เริงร่ากับหาดทรายขาว สนุกกับกิจกรรมทางทะเล",
    }

    const handleVote = async () => {
        if (!selectedOption) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'กรุณาเลือกตัวเลือก',
            })
        }else{
            const result = await Swal.fire({
                title: 'ยืนยันการโหวต',
                text: "คุณต้องการที่จะโหวตหรือไม่ ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก'
            });
            if (result.isConfirmed) {
                setLoaded(true);
                try {
                    const response = await axios.post('/api/votes', {
                        topicId: topicId,
                        userId: userId,
                        optionId: selectedOption
                    });
                    console.log(response.data);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'โหวตสําเร็จ',
                    });
                    setTimeout(() => {
                        router.push('/main');
                    }, 2000);

                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'โหวตไม่สําเร็จ',
                    });
                } finally {
                    setLoaded(false);
                }
            };
        }
    }

    return (
        <div className="flex flex-col py-2 mb-20">
            <div className="flex flex-row items-center justify-center w-full gap-2 mt-4">
                <Image
                    src="/images/vote/logo1.png"
                    alt="logo1"
                    width={100}
                    height={100}
                    style={{ width: '80px', height: 'auto' }}
                />
                <Image
                    src="/images/vote/logo2.png"
                    alt="logo1"
                    width={100}
                    height={100}
                    style={{ width: '80px', height: 'auto' }}
                />
            </div>
            {/* Header */}
            <div className="flex flex-col items-center justify-center">
                <span className="text-[1.2rem] text-[#0056FF] font-bold">ร่วมโหวต</span>
                <span className="text-[1.2rem] text-[#0056FF] font-bold mt-[-5px]">ประเทศที่ต้องการเดินทางไปเปิดประสบการณ์</span>
                <h1 className="text-[2.5rem] text-[#F2871F] font-bold mt-[-15px]">{topic?.title}</h1>
                <p className="text-[1rem] text-black font-bold mt-[-5px]">(ผลงานปี 2567 เดินทางช่วงต้นปี 2568)</p>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center justify-center mt-2">
                <Image
                    src="/images/vote/cover.png"
                    alt="cover"
                    width={400}
                    height={400}
                    style={{ width: '100vh', height: 'auto' }}
                />
            </div>

            {/* Vote */}
            <div className="flex flex-col items-center justify-center mt-5">
                <span className="text-[0.7rem] text-black font-bold">จำกัดการโหวตได้ท่านละ 1 ครั้งและไม่สามารถเปลี่ยนแปลงคำตอบได้ในภายหลัง</span>

                <div className="flex flex-col items-center px-5 text-left w-full">
                    {Array.isArray(topic?.options) && topic?.options.map((option, index) => (
                        <div key={index} className="flex flex-row items-baseline gap-1 mt-4 w-full">
                            <input
                                type="checkbox"
                                id={`option-${option.value}`}
                                name="option"
                                value={option._id}
                                checked={selectedOption === option._id}
                                onChange={() => setSelectedOption(option._id)}
                            />
                            <label
                                htmlFor={`option-${option.value}`}
                                className="text-[0.8rem] text-black font-bold ml-2"
                            >
                                <span className="font-bold mr-1">{option.value}</span> 
                                <span className="text-[0.8rem] font-normal">{optionDetails[index]}</span>
                            </label>
                        </div>
                    ))}
                    <div>
                        <button
                            type="button"
                            className="bg-[#0056FF] text-white font-bold py-2 px-10 rounded-full mt-5"
                            onClick={handleVote}
                        >
                            {loaded ? <CircularProgress /> : "โหวต"}
                        </button>
                    </div>
                </div>
            </div>
        </div>  
    );

}

export default Salestrip;

Salestrip.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Salestrip.auth = true;

