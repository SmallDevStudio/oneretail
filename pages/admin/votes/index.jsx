import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AdminLayout } from '@/themes';
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrView } from "react-icons/gr";

const Votes = () => {
    const [topics, setTopics] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [options, setOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const router = useRouter();

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        const res = await axios.get('/api/topics');
        setTopics(res.data.data);
    };

    const openForm = (topic) => {
        setSelectedTopic(topic);
        setOptions(topic ? topic.options : []);
        setShowForm(true);
    };

    const closeForm = () => {
        setSelectedTopic(null);
        setOptions([]);
        setShowForm(false);
    };

    const handleUpload = (result, index) => {
        const updatedOptions = [...options];
        updatedOptions[index].value = result.info.secure_url;
        setOptions(updatedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const newTopic = {
            title: form.title.value,
            description: form.description.value,
            options
        };

        if (selectedTopic) {
            await axios.put(`/api/topics/${selectedTopic._id}`, newTopic);
        } else {
            await axios.post('/api/topics', newTopic);
        }
        fetchTopics();
        closeForm();
    };

    const handleDelete = async (id) => {
        await axios.delete(`/api/topics/${id}`);
        fetchTopics();
    };

    const addOption = () => {
        setOptions([...options, { type: 'text', value: '' }]);
    };

    const removeOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
    };

    const updateOptionType = (index, type) => {
        const updatedOptions = [...options];
        updatedOptions[index].type = type;
        setOptions(updatedOptions);
    };

    const updateOptionValue = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index].value = value;
        setOptions(updatedOptions);
    };

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentTopics = topics.slice(indexOfFirstRecord, indexOfLastRecord);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleView = (id) => {
        router.push(`/admin/votes/${id}`);
    };

    return (
        <div className="flex flex-col p-10 w-full">
            <h1 className='text-3xl mt-5'>จัดการ Topics Votes</h1>
            <button onClick={() => openForm(null)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl w-1/6 mt-5"
            >
                Add Topic
            </button>
            <table className='w-full mt-5'>
                <thead className='bg-gray-300'>
                    <tr className='text-center font-bold'>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Options</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className='text-left'>
                    {currentTopics.map(topic => (
                        <tr key={topic._id}>
                            <td>{topic.title}</td>
                            <td>{topic.description}</td>
                            <td>
                                <ul className='list-disc list-inside'>
                                    {topic.options.map((option, index) => (
                                        <li key={index}>{option.type}: {option.value}</li>
                                    ))}
                                </ul>
                            </td>
                            <td className='text-center'>
                                <button onClick={() => handleView(topic._id)} className='mr-4'><GrView /></button>
                                <button onClick={() => openForm(topic)} className='mr-4'><FaEdit /></button>
                                <button onClick={() => handleDelete(topic._id)} ><RiDeleteBinLine /></button>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='mt-5'>
                {Array.from({ length: Math.ceil(topics.length / recordsPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => paginate(index + 1)} className={`px-3 py-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                        {index + 1}
                    </button>
                ))}
            </div>
            {showForm && (
                <div className='mt-5'>
                    <form onSubmit={handleSubmit} className=''>
                        <label className='text-black font-bold'>Title:</label>
                        <input type="text" name="title" defaultValue={selectedTopic?.title} required className='border-2 border-gray-300 rounded p-2 mb-2 block' />
                        
                        <label className='text-black font-bold'>Description: </label>
                        <input type="text" name="description" defaultValue={selectedTopic?.description} className='border-2 border-gray-300 rounded p-2 mb-2 block' />
                        
                        <div>
                            <label>Options:</label>
                            {options.map((option, index) => (
                                <div key={index} className='mb-2 flex items-center'>
                                    <select name={`optionType${index}`} value={option.type} onChange={(e) => updateOptionType(index, e.target.value)} className='border-2 border-gray-300 rounded p-2'>
                                        <option value="text">Text</option>
                                        <option value="image">Image</option>
                                        <option value="user">User</option>
                                        <option value="content">Content</option>
                                    </select>
                                    {option.type === 'image' ? (
                                        <div className="ml-2">
                                            {option.value && (
                                                <div className="mb-4">
                                                    <CldImage src={option.value} width={100} height={100} alt="Option Image" />
                                                </div>
                                            )}
                                            <CldUploadWidget
                                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                                onUpload={(result) => handleUpload(result, index)}
                                            >
                                                {({ open }) => (
                                                    <button
                                                        type="button"
                                                        onClick={open}
                                                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
                                                    >
                                                        Upload Image
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                        </div>
                                    ) : (
                                        <input type="text" name="optionValue" value={option.value} onChange={(e) => updateOptionValue(index, e.target.value)} required className='border-2 border-gray-300 rounded p-2 ml-2' />
                                    )}
                                    <button type="button" onClick={() => removeOption(index)} className="ml-2 text-red-500">Remove</button>
                                </div>
                            ))}
                            <button type="button" onClick={addOption} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl mt-3'>Add Option</button>
                        </div>
                        <button type="submit" className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl mt-3'>Save</button>
                        <button type="button" onClick={closeForm} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-3xl mt-3 ml-2'>Close</button>
                    </form>
                </div>
            )}
        </div>
    );
};

Votes.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Votes;
