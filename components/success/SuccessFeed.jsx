import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const SuccessFeed = React.memo(({ contents }) => {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col w-full mb-20 p-2">
            {contents.map((content) => {
                const hasViewed = content.contentviews.some(view => view.userId === session?.user?.id);
                return (
                    <div key={content._id} className="flex flex-row bg-gray-200 mb-2 rounded-md p-2">
                        {/* thumbnail */}
                        <div className="flex justify-center items-center max-h-[150px] min-w-[150px]">
                            <Link href={`/learning/${content._id}`}>
                                <Image
                                    src={content.thumbnailUrl}
                                    alt="Avatar"
                                    width={150}
                                    height={150}
                                    className="rounded-lg object-cover"
                                    loading="lazy"
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                            </Link>
                        </div>
                        {/* content */}
                        <div className="flex flex-col text-left ml-2">
                            {/* title and description */}
                            <div className="flex flex-col max-w-[200px] w-[200px]">
                                <Link href={`/stores/${content._id}`}>
                                    <p className="text-sm font-bold text-[#0056FF] line-clamp-2">{content.title}</p>
                                    <p className="text-xs font-light text-black line-clamp-2">{content.description}</p>
                                </Link>
                            </div>
                            {/* icon container */}
                            <div className="flex flex-row justify-between items-center mt-auto pt-2">
                                <span className="font-light text-black text-xs">การดู {content.views} ครั้ง</span>
                                {hasViewed && <span className="text-green-500 font-bold text-xs">ดูแล้ว</span>}
                            </div>
                        </div>
                        {/* end content */}
                    </div>
                );
            })}
        </div>
    );
});

SuccessFeed.displayName = "SuccessFeed";

export default SuccessFeed;
