import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Image from 'next/image';
import Alert from '@/components/notification/Alert';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import RegisterModal from '@/components/RegisterModal';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Register() {
    const { data: session, status } = useSession();
    const [data, setData] = useState(null);
    const [errors, setErrors] = useState(null);
    const [loadingForm, setLoadingForm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isEmpIdVerified, setIsEmpIdVerified] = useState(false);
    const router = useRouter();
    const userId = session?.user?.id;


    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push('/login');
        }
    }, [status, session, router]);

    

    const onSubmit = async () => {
        setLoadingForm(true);

        if (!data.agree) {
            setLoadingForm(false);
            Alert.error('กรุณายอมรับเงื่อนไขการใช้งาน');
            return;
        }

        const registerData = {
            ...data,
            userId: session?.user?.id,
            pictureUrl: session?.user?.image,
            role: 'user',
            active: true,
        };

        try {
            const response = await axios.post('/api/register', registerData);

            if (!response.data.success) {
                throw new Error('Registration failed');
            }

            setIsOpen(true);

        } catch (error) {
            console.error('Registration error:', error);
            Alert.error('ลงทะเบียนไม่สําเร็จ');
        } finally {
            setLoadingForm(false);
        }
    };

    if (status === "loading") {
        return <Loading />;
    }

    const onRequestClose = () => {
        setIsOpen(false);
        router.push('/loginreward');
    };

    const handleEmpIdChange = async (empId) => {
        setData({ ...data, empId });

        if (empId.length < 5) {
            setErrors(null);
            setIsEmpIdVerified(false);
            return;
        }

        try {
            // เช็ค empId ใน Users
            const userCheckRes = await axios.get(`/api/users/checkEmpId?empId=${empId}`);
            if (userCheckRes.data.exists) {
                setErrors('รหัสพนักงานนี้ถูกใช้งานแล้ว');
                setIsEmpIdVerified(false);
                return;
            }

            // เช็ค empId ใน emp
            const empCheckRes = await axios.get(`/api/emp/checkEmpId?empId=${empId}`);
            if (empCheckRes.data.exists) {
                setData({ ...data, empId, fullname: empCheckRes.data.name });
                setErrors(null);
                setIsEmpIdVerified(true); // ถ้าเจอ empId ใน emp ให้ enable input ทั้งหมด
            } else {
                setErrors('รหัสพนักงานนี้ไม่มีในระบบ');
                setIsEmpIdVerified(false);
            }
        } catch (error) {
            console.error('Error checking empId:', error);
            setErrors('ไม่สามารถตรวจสอบรหัสพนักงานได้');
            setIsEmpIdVerified(false);
        }
    };


    return (
        <div className="flex flex-col justify-center p-5 bg-white">
            <div className="block justify-center items-center text-center mt-10 mb-2">
                <div className="mb-4">
                    <Image 
                        className="inline"
                        src="/dist/img/logo-one-retail.png" 
                        alt="one Retail Logo" 
                        width={200} 
                        height={200} 
                        priority 
                    />
                </div>
                <span className="text-xl font-black text-[#F2871F]" style={{ fontFamily: 'ttb', fontWeight: 'bold' }}>
                    ลงทะเบียนการใช้บริการ
                </span>
            </div>
            <div className="flex flex-col p-3">
                    <div className="flex flex-col justify-center items-center text-center mb-4">
                        <div className="flex flex-col justify-center items-center text-center mb-2" style={{ width: 150, height: 150 }}>
                            <Image
                                className="flex rounded-full overflow-hidden border-2 border-[#0056FF]"
                                src={session?.user?.image || '/dist/img/avatar.png'}
                                alt="Profile Avatar"
                                width={150}
                                height={150}
                                priority
                            />
                        </div>
                        <span className="text-xl font-black text-[#1E3060]" style={{ fontFamily: 'Ekachon' }}>
                            {session?.user?.name}
                        </span>
                    </div>
                    <div className="block mb-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                                </svg>
                            </div>
                            <input
                                className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="number"
                                placeholder="รหัสพนักงาน"
                                maxLength={5}
                                minLength={5}
                                value={data?.empId || ''}
                                onChange={(e) => handleEmpIdChange(e.target.value)}
                                required
                            />
                        </div>
                        <div className="text-red-500 text-sm font-bold text-left ml-10 h-2">
                            {errors && <div className="text-red-500 text-sm font-bold">{errors}</div>}
                        </div>
                    </div>
                    <div className="block mb-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </div>
                            <input
                                className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                placeholder="ชื่อ-นามสกุล"
                                value={data?.fullname || ''}
                                onChange={(e) => setData({ ...data, fullname: e.target.value })}
                                disabled={!isEmpIdVerified}
                                required
                            />
                        </div>
                    </div>
                    <div className="block mb-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <svg className=" w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z" />
                                </svg>
                            </div>
                            <input
                                className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-12 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="phone"
                                placeholder="เบอร์โทรศัพท์"
                                value={data?.phone || ''}
                                onChange={(e) => setData({ ...data, phone: e.target.value })}
                                disabled={!isEmpIdVerified}
                                required
                            />
                        </div>
                    </div>
                    <div className="block mb-2">
                        <div className="mt-10">
                            <label htmlFor="address" className="block mb-2 text-lg font-bold text-gray-900 dark:text-white">ที่อยู่สำหรับจัดส่งของรางวัล</label>
                            <textarea
                                id="address"
                                rows={4}
                                className="block p-2 w-full text-lg text-gray-900 bg-gray-200 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="ที่อยู่สาขาหรือฮับที่ท่านประจำอยู่"
                                value={data?.address || ''}
                                disabled={!isEmpIdVerified}
                                onChange={(e) => setData({ ...data, address: e.target.value })}
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div>
                            <div>
                                <input
                                    id="agree"
                                    type="checkbox"
                                    checked={data?.agree || false}
                                    disabled={!isEmpIdVerified}
                                    onChange={(e) => setData({ ...data, agree: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="agree" className="ml-2 text-sm font-bold text-gray-900 dark:text-white">ฉันยอมรับข้อตกลงและเงื่อนไข</label>
                            </div>
                            <div className="block">
                                <ul className="text-sm font-light text-gray-900 dark:text-gray-400 list-disc ml-10 mb-4 mt-2 text-left">
                                    <li className="mb-2">
                                        เราขอยื่นยันว่าเราให้ความสำคัญกับความเป็นส่วนตัวและความปลอดภัยของข้อมูลส่วนบุคคลของคุณ ดังนั้นเรามุ่งมั่นที่จะปฏิบัติตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PD PA) ในการเก็บรวบรวมใช้และประมวลผลข้อมูลส่วนบุคคลของคุณข้อมูลที่เราเก็บรวบรวมจะใช้เพื่อวัตถุประสงค์ที่เกี่ยวกับการให้บริการ และปรับปรุงประสิทธิภาพของบริการของเราเก่านั้นและจะไม่นำข้อมูลของคุณไปใช้เพื่อวัตถุประสงค์อื่นๆโดยไม่ได้รับความยินยอมจาก คุณล่วงหน้า
                                    </li>
                                    <li className="mb-2">
                                        เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของคุณแก่บุคคลที่สามได้ยกเว้น เฉพาะในกรณีที่เราจำเป็นต้องทำเช่นนั้นตามกฎหมายหรือโดยคำสั่งของหน่วยงานราชการที่มีอำนาจ
                                    </li>
                                    <li className="mb-2">
                                        ผู้ขออนุญาตใช้งานจะต้องไม่เผยแพร่ข้อมูลข่าวสารนี้ต่อบุคคลภายนอก ttb โดยเด็ดขาด
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-5 w-full">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-3xl text-lg px-5 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[80%] h-15"
                            onClick={onSubmit}
                            disabled={!isEmpIdVerified || loadingForm}
                        >
                            {loadingForm ? "กําลังบันทึก..." : "ลงทะเบียน"}
                        </button>
                    </div>
                <RegisterModal isOpen={isOpen} onRequestClose={onRequestClose} />
            </div>
        </div>
    );
}
