import React, { useState, useEffect } from "react";
import { AppLayout } from "@/themes";
import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function CampaignId() {
    const [campaigns, setCampaigns] = useState([]);
    const router = useRouter();
    const { id } = router.query;

    const { data, error , isLoading, mutate } = useSWR(`/api/campaigns/${id}`, fetcher, {
        onSuccess: (data) => {
          setCampaigns(data.data);
        },
      });


    if (isLoading || !data || !campaigns ) return <Loading />;
    if (error) return <div>Failed to load</div>;

    return (
        <div className="flex flex-col mb-20">
            <div className="flex flex-row justify-between items-center w-full mt-10 mb-5">
                <IoIosArrowBack className="cursor-pointer text-gray-700" size={30} 
                    onClick={() => router.back()}
                />
                <h1 className="text-3xl font-bold text-[#0056FF] uppercase">Campaign</h1>
                <div></div>
            </div>
            
            {campaigns && (
                <div className="flex flex-col items-center w-full">
                    <Image
                        src={campaigns?.smallbanner?.url}
                        alt="Campaign"
                        width={600}
                        height={600}
                        loading="lazy"
                        className="w-full mb-2"
                        style={{ 
                            objectFit: "cover", 
                            objectPosition: "center", 
                            height: "auto", 
                            width: "100%" 
                        }}
                        onClick = {() => router.push(campaigns.url)}
                    />
                    <div className="flex flex-col p-5 w-full">
                        <span className="font-bold text-[#0056FF] text-xl mb-2 text-left">{campaigns.title}</span>
                        {campaigns.image && (
                                <Image
                                    src={campaigns?.image?.url}
                                    alt="Campaign"
                                    width={350}
                                    height={350}
                                    priority
                                    className="flex"
                                    style={{ 
                                        objectFit: "contain", 
                                        height: "auto", 
                                        width: "100%",
                                        maxWidth: "100vw",
                                    }}
                                    onClick = {() => router.push(campaigns.url)}
                                />
                        )}
                        <p className="text-md">{campaigns.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
