import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import moment from "moment";
import "moment/locale/th";
import Swal from "sweetalert2";

moment.locale('th');

export default function View({ data, onClose }) {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);

    const { data: session } = useSession();
    const userId = session?.user?.id;
    const router = useRouter();

    const handleFieldChange = (e, field, index) => {
        const { name, value } = e.target;

        setAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];
            const existingAnswerIndex = updatedAnswers.findIndex(answer => answer.index === index + 1);

            if (existingAnswerIndex !== -1) {
                // Update existing answer
                updatedAnswers[existingAnswerIndex] = {
                    ...updatedAnswers[existingAnswerIndex],
                    [name]: value,
                };
            } else {
                // Add new answer
                updatedAnswers.push({
                    index: index + 1,
                    [name]: value,
                });
            }
            return updatedAnswers;
        });
    };

    const handleSubmit = async () => {
        const newAnswers = {
            formId: data._id,
            answers,
            userId,
        }
        try {
            const response = await axios.post('/api/forms/answers', newAnswers);
            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#0056FF',
                    allowOutsideClick: false
                }).then(() => {
                    onClose();
                });
            }
           
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col w-full">
            <div className="w-full">
                {data.image && (
                    <Image
                        src={data.image.url}
                        alt={data.title}
                        width={500}
                        height={500}
                    />
                )}
                {data.youtube && (
                    <ReactPlayer
                        url={data.youtube.url + '&modestbranding=1&rel=0'}
                        controls
                        width="100%"
                        height="250px"
                        playing={true}
                    />
                )}
            </div>
            <div className="w-full mt-2">
                <h1 className="text-3xl font-bold">{data.title}</h1>
                <p className="text-lg">{data.description}</p>
                <p className="text-sm text-gray-400">{moment(data.date).format('ll')}</p>
            </div>
            <div className="w-full mt-2">
                {data.fields.map((field, index) => (
                    <div key={index} className="flex flex-col w-full mt-2 border-2 p-2 rounded-lg">
                        <h1 className="text-xl font-bold">{field.title}</h1>
                        <p className="text-md text-gray-400">{field.description}</p>
                        {field.image && (
                            <div className="flex mt-2">
                                <Image
                                    src={field.image.url}
                                    alt={field.title}
                                    width={500}
                                    height={500}
                                    style={{width: '200px', height: 'auto'}}
                                />
                            </div>
                        )}
                        {field.youtube && (
                            <div className="flex mt-2">
                                <ReactPlayer
                                    url={field.youtube.url + '&modestbranding=1&rel=0'}
                                    controls
                                    width="100%"
                                    height="230px"
                                    playing={false}
                                />
                            </div>
                        )}
                        <div>
                            {field.type === 'text' ? (
                                <div>
                                    <textarea
                                        className="w-full mt-2 border-2 p-2 rounded-lg"
                                        name="text"
                                        placeholder="กรอกข้อมูล"
                                        value={answers.find(answer => answer.index === index + 1)?.text || ''}
                                        onChange={(e) => handleFieldChange(e, field, index)}
                                        rows={3}
                                    />
                                </div>
                            ) : (
                                <div className="mt-2 px-2.5">
                                    {field.options.map((option, optIndex) => (
                                        <div 
                                            key={optIndex} 
                                            className="flex flex-row gap-2"
                                        >
                                            <input 
                                                type="radio" 
                                                id={option} 
                                                name="option" 
                                                value={option}
                                                checked={answers.find(answer => answer.index === index + 1)?.option === option}
                                                onChange={(e) => handleFieldChange(e, field, index)} 
                                            />
                                            <label htmlFor={option}>{option}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div className="w-full mt-2">
                    <button
                        type="submit"
                        className="bg-[#0056FF] text-white font-bold py-2 px-4 rounded-full"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
