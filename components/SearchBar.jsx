import React, { useState, useEffect } from 'react';
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';

const SearchBar = ({ page }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (query.length > 0) {
            axios.get(`/api/contents/search?search=${query}&page=${page}`)
                .then(response => {
                    if (response.data.success) {
                        setResults(response.data.data);
                        setShowDropdown(true);
                    }
                })
                .catch(error => console.error('Error fetching search results:', error));
        } else {
            setResults([]);
        }
    }, [page, query]);

    const handleChange = (e) => {
        setQuery(e.target.value);
        // Reset results if the input is cleared
        if (e.target.value.length === 0) {
            setResults([]);
        }
    };

    const handleClick = (result) => {
        if (result.categories._id === '665c4c51013c2e4b13669c90') {
            router.push(`/stores/${result._id}`);
        } else if (result.categories._id === '665c561146d171292cbda9eb') {
            router.push(`/learning/${result._id}`);
        } else {
            // Handle other cases or default behavior
            console.log('No matching category for this content');
        }
        setQuery('');
        setResults([]);
    };

    return (
        <div className="flex w-full">
            <div className="flex justify-center w-full px-2 mb-2">
                <div className="flex flex-row bg-gray-50 border rounded-xl px-2 py-1 relative w-full">
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder="ค้นหา"
                        className="w-full text-xs px-4 focus:outline-none bg-gray-50"
                    />
                    <IoSearch className="text-gray-400" size={20}/>
                    {showDropdown && (
                        <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-b-xl z-10">
                            {results.map(result => (
                                <div 
                                    key={result._id} 
                                    className="flex flex-col text-left px-2 py-2 cursor-pointer" 
                                    onClick={() => handleClick(result)}
                                >
                                    <div className='flex flex-row'>
                                        <div className='flex justify-center items-center max-w-[120px] min-w-[100px] min-h-[60px]'>
                                            <Image 
                                                src={result.thumbnailUrl} 
                                                width={120} 
                                                height={80} 
                                                alt={result.title} 
                                                className="rounded-lg object-cover"
                                                style={{ width: '100px', height: '60px'}}
                                            />
                                        </div>
                                        <div className='flex flex-col ml-1'>
                                            <span className="text-sm line-clamp-2">{result.title}</span>
                                            <div></div>
                                            <div className='flex flex-row gap-2'>
                                                <div className="bg-[#0056FF] rounded-full px-2 text-white">
                                                    <span className="text-xs">{result.subcategories.title}</span>
                                                </div>
                                                {result.groups && (
                                                    <div className="bg-yellow-600 rounded-full px-2 text-white">
                                                        <span className="text-xs">{result.groups.name}</span>
                                                    </div>
                                                )}
                                                {result.subgroups && (
                                                    <div className="bg-green-400 rounded-full px-2 text-white">
                                                        <span className="text-xs">{result.subgroups.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
