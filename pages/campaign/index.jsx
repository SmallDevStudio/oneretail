import { useState } from "react";
import { AppLayout } from "@/themes";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Campaign() {
    const [campaigns, setCampaigns] = useState([]);
    const router = useRouter();

    const { data, error: swrError, mutate } = useSWR('/api/campaigns', fetcher, {
        onSuccess: (data) => {
          setCampaigns(data.data);
        },
      });

      const handleOnLink = (id) => {
        router.push(`/campaign/${id}`);
      }

    return (
        <main className="flex flex-col dark:bg-gray-900 mb-20">
        
            <div className="relative p-3top-[-40px]">
                <div className="flex items-center text-center justify-center mt-[20px] p-2 px-1 pz-1">
                    <span className="text-[35px] font-black text-[#0056FF] dark:text-white uppercase">Campaign</span>
                </div>
                <div className="absolute top-0 left-0 mt-10"
                    onClick={() => router.back()}
                >
                    <div className="flex mb-5 w-5 h-5 text-gray-500 mt-2 ml-2">
                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 69.31 117.25">
                            <path class="cls-1" d="M58.62,117.25c-2.74,0-5.47-1.04-7.56-3.13L3.13,66.18c-4.17-4.17-4.17-10.94,0-15.12L51.07,3.13c4.17-4.17,10.94-4.17,15.11,0,4.17,4.17,4.17,10.94,0,15.12L25.8,58.62l40.38,40.38c4.17,4.17,4.17,10.94,0,15.12-2.09,2.09-4.82,3.13-7.56,3.13Z"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center max-w-[100vw] p-2">
                <div className="flex flex-col w-full">
                    <div className="relative flex-col w-full justify-center items-center">
                        {campaigns && campaigns.map((campaign, index) => (
                            <div key={index} className="w-full"
                                onClick={() => handleOnLink(campaign._id)}
                            >
                                <Image
                                    src={campaign.smallbanner.url}
                                    alt="Campaign"
                                    width={600}
                                    height={600}
                                    loading="lazy"
                                    className="w-full rounded-2xl mb-2"
                                    style={{ width: '600px', height: 'auto' }}
                                    onClick={() => router.push("/campaign/content/2")}
                                />
                            </div>
                        ))}
                    </div>
                        
                </div>
            </div>
        </main>
    );
}

Campaign.getLayout = (page) => <AppLayout>{page}</AppLayout>;
Campaign.auth = true