"use client"

import { Carousel } from "flowbite-react";
import Image from "next/image";

export default function MainCarouel() {
   
    return (
        <div className="h-80 sm:h-74 xl:h-120 2xl:h-140 w-full">
            <Carousel
                autoPlay
                interval={5000}
                pauseOnHover
            >
                <Image 
                    src="/dist/img/carousel/1.jpeg"
                    alt="One Retail Carousel Example"
                    width={500}
                    height={500}
                    className="w-full h-full z-10"
                    priority
                    style={{
                        objectFit: "cover",
                    }}
                />
                <Image 
                    src="/dist/img/carousel/2.jpeg"
                    alt="One Retail Carousel Example"
                    width={500}
                    height={500}
                    className="w-full h-full z-10"
                    priority
                    style={{
                        objectFit: "cover",
                    }}
                />
                <Image 
                    src="/dist/img/carousel/3.jpg"
                    alt="One Retail Carousel Example"
                    width={500}
                    height={500}
                    className="w-full h-full z-10"
                    priority
                    style={{
                        objectFit: "cover",
                    }}
                />
                <Image 
                    src="/dist/img/carousel/4.jpeg"
                    alt="One Retail Carousel Example"
                    width={500}
                    height={500}
                    className="w-full h-full z-10"
                    priority
                    style={{
                        objectFit: "cover",
                    }}
                />
            </Carousel>
        </div>
    );
}