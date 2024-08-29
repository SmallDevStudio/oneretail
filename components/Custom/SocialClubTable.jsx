import { useState } from 'react';
import Image from "next/image";
import moment from 'moment';
import "moment/locale/th";

moment.locale('th');

const SocialClubTable = ({data}) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            <div>
                <table className='table-auto w-full'>
                    <thead>
                    <tr>
                        <th className='border px-4 py-2'>No</th>
                        <th className='border px-4 py-2'>Picture</th>
                        <th className='border px-4 py-2'>EmployeeCode</th>
                        <th className='border px-4 py-2'>Name</th>
                        <th className='border px-4 py-2'>Options</th>
                        <th className='border px-4 py-2'>Creator</th>
                        <th className='border px-4 py-2'>Date</th>
                        <th className='border px-4 py-2'>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                        {data && data.map((item, index) => (
                            <tr key={index}>
                                <td className='border px-4 py-2'>{index + 1}</td>
                                <td className='border px-4 py-2'>
                                    {item.emp && 
                                        <Image 
                                            src={item.emp.pictureUrl} 
                                            width={50} 
                                            height={50} 
                                            alt='profile' 
                                            className='rounded-full'
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                            }}
                                            />
                                    }
                                </td>
                                <td className='border px-4 py-2'>{item.empId}</td>
                                <td className='border px-4 py-2'>{item.empName}</td>
                                <td className='border px-4 py-2 text-sm'>
                                    {Array.isArray(item.options) && item.options.map((option, index) => (
                                        <li key={index}>{option}</li>
                                    ))}
                                </td>
                                <td className='border px-4 py-2'>
                                    {item.creator && 
                                        <Image 
                                            src={item.creator.pictureUrl} 
                                            width={50} 
                                            height={50} 
                                            alt='profile' 
                                            className='rounded-full border'
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                            }}
                                            />
                                    }
                                </td>
                                <td className='border px-4 py-2 text-xs'>{moment(item.createdAt).format('LLLL')}</td>
                                <td className='border px-4 py-2'>
                                    <button
                                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex flex-row justify-between items-center mt-1 px-1 text-sm">
                    <div>
                        <span>Total Record: {data.length}</span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <span>PageSize:</span>
                        <select
                            className="border border-gray-300 p-1 rounded"
                            value={pageSize}
                            onChange={(e) => setPageSize(e.target.value)}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div>
                        <span>Page:1/1</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialClubTable;