import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import ReactPlayer from "react-player";

const LearnFeed2 = ({ contents }) => {
    const { data: session } = useSession();
    // Get unique group names and add "All"
    const groups = ["All", ...new Set(contents.map(content => content.groups.name))];

    const [selectedGroup, setSelectedGroup] = useState("All");
    const [selectedSubGroup, setSelectedSubGroup] = useState("All");
    const [subGroups, setSubGroups] = useState([]);
    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        const filteredContents = selectedGroup === "All" ? contents : contents.filter(content => content.groups.name === selectedGroup);
        const uniqueSubGroups = ["All", ...new Set(filteredContents.flatMap(content => content.subgroups ? content.subgroups.map(subgroup => subgroup.name) : []))];
        setSubGroups(uniqueSubGroups);

        if (filteredContents.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredContents.length);
            setVideoUrl(filteredContents[randomIndex].slug);
        } else {
            setVideoUrl(null);
        }
    }, [selectedGroup, contents]);

    const filteredContents = contents.filter(content => 
        (selectedGroup === "All" || content.groups.name === selectedGroup) &&
        (selectedSubGroup === "All" || content.subgroups && content.subgroups.some(subgroup => subgroup.name === selectedSubGroup))
    );

    return (
        <div className="flex flex-col w-full">
            <div className="relative">
                <ul className="flex flex-row w-full rounded-xl p-1 gap-5 overflow-x-auto overflow-hidden text-sm mb-2 scrollbar-hide px-6" 
                    style={{
                        scrollbarWidth: "none",
                    }}
                >
                    {groups.map(group => (
                        <li
                            key={group}
                            className={`cursor-pointer px-2 py-1 rounded-xl text-nowrap ${selectedGroup === group ? "bg-gray-500 text-white" : "bg-gray-300 text-black"}`}
                            onClick={() => {
                                setSelectedGroup(group);
                                setSelectedSubGroup("All");
                            }}
                        >
                            {group}
                        </li>
                    ))}
                </ul>
                <div className="absolute top-0 right-0 w-10 h-full bg-gradient-to-l from-white"></div>
            </div>
            {subGroups.length > 1 && (
                <div className="relative">
                    <ul className="flex flex-row w-full rounded-xl p-1 gap-5 overflow-x-auto overflow-hidden text-sm mb-2 scrollbar-hide" style={{
                        scrollbarWidth: "none",
                    }}
                    >
                        {subGroups.map(subGroup => (
                            <li
                                key={subGroup}
                                className={`cursor-pointer px-2 py-1 rounded-xl text-nowrap ${selectedSubGroup === subGroup ? "bg-gray-500 text-white" : "bg-gray-300 text-black"}`}
                                onClick={() => setSelectedSubGroup(subGroup)}
                            >
                                {subGroup}
                            </li>
                        ))}
                    </ul>
                    <div className="absolute top-0 right-0 w-10 h-full bg-gradient-to-l from-white"></div>
                </div>
            )}
            {videoUrl && (
                <div className="justify-center flex min-w-[100vw]">
                    <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${videoUrl}`}
                        loop={true}
                        width="100%"
                        height="250px"
                        playing={true}
                        controls
                    />
                </div>
            )}
            <div className="flex flex-col w-full mb-20 p-2">
                {filteredContents.map((content) => {
                    const hasViewed = content.contentviews.some(view => view.userId === session?.user?.id);
                    return (
                        <div key={content._id} className="flex flex-row bg-gray-200 mb-2 rounded-md p-2">
                            {/* thumbnail */}
                            <div className="flex flex-col justify-center items-center max-h-[150px] min-w-[150px]">
                                <Link href={`/learning/${content._id}`}>
                                    <Image
                                        src={content.thumbnailUrl}
                                        alt="Avatar"
                                        width={150}
                                        height={150}
                                        className="rounded-lg object-cover"
                                        style={{ width: 'auto', height: 'auto' }}
                                        loading="lazy"
                                    />
                                </Link>
                            </div>
                            {/* content */}
                            <div className="flex flex-col text-left ml-2">
                                {/* title and description */}
                                <div className="flex flex-col max-w-[200px] w-[200px]">
                                    <Link href={`/learning/${content._id}`}>
                                        <p className="text-sm font-bold text-[#0056FF] line-clamp-2">{content.title}</p>
                                        <p className="text-xs font-light text-black line-clamp-2">{content.description}</p>
                                    </Link>
                                </div>
                                {/* icon container */}
                                <div className="flex flex-row justify-between items-center mt-auto pt-2">
                                    <span className="font-light text-black text-xs">การดู {content.views} ครั้ง</span>
                                    {hasViewed && <span className="bg-green-500 font-bold text-xs text-white rounded-full px-2">ดูแล้ว</span>}
                                </div>
                            </div>
                            {/* end content */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LearnFeed2;
