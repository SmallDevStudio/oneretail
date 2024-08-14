import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Carousel() {
  const { data: images } = useSWR("/api/main/carousel", fetcher);

  const router = useRouter();

  const settings = {
    accessibility: true,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: 'linear',
    lazyLoad: 'ondemand',
  };

  const handleClick = (url) => {
    if (url) {
      router.push(url);
    }
  }

  return (
    <div className="relative w-full">
      <Slider {...settings}>
        {Array.isArray(images) && images.map((image, index) => (
          <div key={index}>
            <Image
              src={image.image.url}
              alt={'One Retail Carousel' + index}
              width={750}
              height={422}
              className="relative w-full object-cover"
              loading="lazy"
              style={{ width: '100%', height: 'auto' }}
              onClick={handleClick(image.url)}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
