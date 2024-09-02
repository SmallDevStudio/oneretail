import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";
import styles from '@/styles/carousel.module.css';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Carousel() {
  const { data: images } = useSWR("/api/main/carousel", fetcher);

  const router = useRouter();

  const settings = {
    accessibility: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    dots: true,
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
      <Slider {...settings} className={styles.slider}>
        {Array.isArray(images) && images.map((image, index) => (
          <div key={index} onClick={() => handleClick(image.url)}>
            <Image
              src={image.image.url}
              alt={'One Retail Carousel' + index}
              width={750}
              height={422}
              className="relative w-full object-cover"
              loading="lazy"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
