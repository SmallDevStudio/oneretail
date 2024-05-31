import "slick-carousel/slick/slick.css";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";

export default function Carousel() {

  const settings = {
    accessibility: true,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: 'linear',
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <Image
            src="/images/LoginReward.jpg"
            alt="One Retail Carousel Example"
            width={500}
            height={500}
          />
        </div>
        <div>
          <Image
            src="/images/Name.jpg"
            alt="One Retail Carousel Example"
            width={500}
            height={500}
          />
        </div>
      </Slider>
    </div>
  );
}