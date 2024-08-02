import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import CircularProgress from '@mui/material/CircularProgress';
const ContentWidget = () => {
    const [contents, setContents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/dashboard/content', {
                    params: { category: filter !== "All" ? filter : undefined }
                });
                setContents(response.data.data.contents);
                setCategories(response.data.data.categories);
                setLoading(false);
            } catch (error) {
                setError("An unexpected error occurred");
                setLoading(false);
            }
        };

        fetchData();
    }, [filter]);

    return (
        <div className="w-full p-2 border-2 rounded-xl shadow-lg">
            <div className="flex justify-center items-center">
                <div className="flex justify-space-around items-center mb-2">
                    <button
                        className={`font-bold rounded-full ${filter === "All" ? "active" : ""} ${filter === "All" ? "bg-[#F68B1F] text-white" : "bg-white text-black"}`}
                        onClick={() => setFilter("All")}
                        style={{
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                        }}
                    >
                        All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category._id}
                            className={`font-bold rounded-full ${filter === category._id ? "active" : ""} ${filter === category._id ? "bg-[#F68B1F] text-white" : "bg-white text-black"}`}
                            onClick={() => setFilter(category._id)}
                            style={{
                                padding: "0.5rem 1rem",
                                cursor: "pointer",
                            }}
                        >
                            {category.title}
                        </button>
                    ))}
                </div>
            </div>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <p>{error}</p>
            ) : (
                <table className="w-full text-sm">
                    <thead className="bg-[#F68B1F] text-white">
                        <tr>
                            <th className="px-4 py-2">Rank</th>
                            <th className="px-4 py-2">Views</th>
                            <th className="px-4 py-2">Thumbnail</th>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">SubCategory</th>
                            <th className="px-4 py-2">Group</th>
                        </tr>
                    </thead>
                    <tbody className="border-b">
                        {contents.slice(0, 10).map((content, index) => (
                            <tr key={content._id}>
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{content.views}</td>
                                <td className="border px-4 py-2">
                                    <Image
                                        src={content.thumbnailUrl}
                                        alt="Avatar"
                                        width={40}
                                        height={40}
                                        className="rounded-lg object-cover"
                                        loading="lazy"
                                        style={{ width: 'auto', height: 'auto' }}
                                    />
                                </td>
                                <td className="border px-4 py-2">{content.title}</td>
                                <td className="border px-4 py-2">{content.categories.title}</td>
                                <td className="border px-4 py-2">{content.subcategories.title}</td>
                                <td className="border px-4 py-2">{content.groups.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ContentWidget;
