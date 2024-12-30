import { useState, useEffect } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { AppLayout } from '@/themes';
import { IoIosArrowBack } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { Divider } from '@mui/material';
import Loading from '@/components/Loading';

const fetcher = url => axios.get(url).then(res => res.data);

const CoursesApp = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const { data: session, status } = useSession();
    const router = useRouter();

    const { data, error, mutate, isLoading } = useSWR("/api/courses", fetcher, {
        onSuccess: (data) => {
            setCourses(data.data);
        },
    });

    console.log('courses:', courses);

    if (isLoading) return <Loading />;
    if (error) return <div>Failed to load</div>;

    return (
      <div className='flex flex-col p-2 w-full'>
        <div className='flex flex-row justify-between items-center'>
            <div>
                <IoIosArrowBack 
                    className="text-xl inline text-gray-700"
                    onClick={() => router.back()}
                    size={30}
                />
            </div>
            <span className="text-3xl font-bold mt-1 text-[#0056FF]">
                หลักสูตร
            </span>
            <div></div>
        </div>

        <Divider 
            variant="fullWidth"
            className='mt-2'
        />
        
        <div className='flex flex-col gap-2 px-4 mt-4 w-full'>
            {courses.map((course, index) => (
                
                <div 
                    key={index}
                >
                    <div  
                        className='flex flex-col cursor-pointer'
                        onClick={() => router.push(`/courses/${course?.course?._id}`)}
                    >
                        <span className='text-sm font-bold'>{course?.course?.title}</span>
                        <span className='text-xs font-light text-gray-500'>{course?.course?.description}</span>
                            
                        
                        <div className='flex flex-row justify-between items-center mt-1 w-full'>
                            <div className='flex flex-row items-center gap-1'>
                                <span className='text-md font-bold text-[#0056FF]'>{course.rating}</span>
                                {course.rating > 0 ? (
                                    Array.from({ length: course?.rating }, (_, i) => (
                                        <>                           
                                            <FaStar key={i} className="text-yellow-500" size={15} />
                                        </>
                                    ))
                                ) : (
                                    <FaStar className="text-gray-200" size={15} />
                                )}
                                <span className='text-sm font-bold text-[#0056FF] ml-2'>คะแนนหลักสูตร</span>
                                <span className='text-xs font-light text-gray-500'>({course?.questionnaires?.length})</span>
                            </div>
                        </div>
                        <Divider key={index} className='mt-1'/>
                    </div>
                </div>
                
            ))}
        </div>
        
      </div>  
    );
}

export default CoursesApp;

CoursesApp.getLayout = (page) => <AppLayout>{page}</AppLayout>;
CoursesApp.auth = true;
