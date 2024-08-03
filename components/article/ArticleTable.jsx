import React, { useState } from "react";
import moment from "moment";
import "moment/locale/th";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import PreviewModal from "./PreviewModal";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const ArticleTable = ({ articles, onDelete, onStatusChange, onPublishedChange, onSearch }) => {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleView = (article) => {
        setSelectedArticle(article);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedArticle(null);
    };

    const handleStatusChange = (article) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to change the status of this article?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, change it!",
            cancelButtonText: "No, cancel!",
        }).then((result) => {
            if (result.isConfirmed) {
                onStatusChange(article);
            }
        });
    };

    const handlePublishedChange = (article) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to change the published status of this article?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, change it!",
            cancelButtonText: "No, cancel!",
        }).then((result) => {
            if (result.isConfirmed) {
                onPublishedChange(article);
            }
        });
    };

    const handleSearchChange = (event, value) => {
        setSearchTerm(value);
        onSearch(value);
    };
    const tagsAndNames = articles.flatMap(article => [article.title, ...article.tags.map(tag => tag.name)]);
    return (
        <div className="flex flex-col w-full p-2">
            <div className="flex mb-4 justify-between">
                <Autocomplete
                    options={tagsAndNames}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search by title or tags"
                            variant="outlined"
                            size="small"
                            style={{
                                width: '300px',
                            }}
                        />
                    )}
                />
                <button className="text-white text-sm font-bold bg-[#0056FF] p-2 rounded-full"
                        onClick={() => router.push('/admin/articles/add')}
                    >
                        เพิ่มบทความ
                </button>
            </div>
            <table className="table-auto border-collapse border-2 border-gray-200">
                <thead className="bg-gray-200 text-sm">
                    <tr className="text-center">
                        <th>Status</th>
                        <th>หัวเรื่อง</th>
                        <th>Author</th>
                        <th>Published</th>
                        <th>วันที่</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.length > 0 ? articles.map((article) => (
                        <tr key={article._id} className="text-center">
                            <td
                                className={`cursor-pointer ${article.status === "draft" ? "bg-red-500" : "bg-green-500"} font-bold text-white rounded-full`}
                                onClick={() => handleStatusChange(article)}
                            >
                                {article.status === "draft" ? "Draft" : "Published"}
                            </td>
                            <td>{article.title}</td>
                            <td>
                                <div className="flex items-center justify-center gap-4">
                                    <Image
                                        src={article.user.pictureUrl}
                                        alt="author"
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                        style={{ width: "30px", height: "30px" }}
                                    />
                                    {article.user.empId}: {article.user.fullname}
                                </div>
                            </td>
                            <td
                                className={`cursor-pointer ${article.published ? "bg-green-500" : "bg-red-500"} font-bold text-white rounded-full`}
                                onClick={() => handlePublishedChange(article)}
                            >
                                {article.published ? "Yes" : "No"}
                            </td>
                            <td>{moment(article.createdAt).fromNow()}</td>
                            <td className="flex justify-center text-center items-center">
                                <button onClick={() => handleView(article)}>
                                    <IoEyeOutline className="text-xl font-bold" />
                                </button>
                                <button className="ml-2" onClick={() => router.push(`/admin/articles/edit?id=${article._id}`)}>
                                    <FaRegEdit />
                                </button>
                                <button className="ml-2" onClick={() => onDelete(article._id)}>
                                    <RiDeleteBinLine />
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <div>
                            <span className="text-center text-sm">ไม่มีข้อมูล</span>
                        </div>
                    )}
                </tbody>
            </table>
            {isModalOpen && (
                <PreviewModal article={selectedArticle} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default ArticleTable;
