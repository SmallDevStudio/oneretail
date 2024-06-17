import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";

export default function Carousel() {

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

  const images = [
    { src: "/images/LoginReward.jpg", alt: "One Retail Carousel Example 1", width: 750, height: 422 },
    { src: "/images/Name.jpg", alt: "One Retail Carousel Example 2", width: 750, height: 422 }
  ];

  return (
    <div className="relative w-full">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              layout="responsive"
              objectFit="cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
