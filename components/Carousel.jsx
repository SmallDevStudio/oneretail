import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";
import styles from '@/styles/carousel.module.css';
import ReactPlayer from "react-player";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Carousel() {
  const { data: mediaItems } = useSWR("/api/main/carousel", fetcher);
  const router = useRouter();
  const sliderRef = useRef(null); // Reference to the slider
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide
  const [isPlaying, setIsPlaying] = useState(false); // Track if the video is playing

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
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    },
  };

  const handleClick = (url) => {
    if (url) {
      router.push(url);
    }
  };

  // Handle video play and pause autoplay
  const handleVideoPlay = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPause(); // Pause autoplay
      setIsPlaying(true); // Set video to playing
    }
  };

  // Handle video end and resume autoplay
  const handleVideoEnd = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPlay(); // Resume autoplay
      setIsPlaying(false); // Set video to not playing
    }
  };

  return (
    <div className="relative w-full">
      <Slider ref={sliderRef} {...settings} className={styles.slider}>
        {Array.isArray(mediaItems) && mediaItems.map((media, index) => (
          <div key={index} onClick={() => handleClick(media.url)}>
            {media.media && media.media.type === 'image' ? (
              <Image
                src={media.media.url}
                alt={`Carousel Image ${index}`}
                width={750}
                height={422}
                className="relative w-full object-cover"
                loading="lazy"
                style={{ width: '100%', height: 'auto' }}
              />
            ) : media.media && media.media.type === 'video' ? (
              <video
                src={media.media.url}
                alt={`Carousel Video ${index}`}
                controls
                className="relative w-full"
                style={{ width: '100%', height: 'auto' }}
                onPlay={handleVideoPlay}
                onEnded={handleVideoEnd}
              />
            ) : media.youtube ? (
              <ReactPlayer
                url={media.youtube.url}
                playing={currentSlide === index && isPlaying} // Play video if it's the current slide
                muted={true} // Mute the video to ensure autoplay works in most browsers
                width={'100%'}
                height={'240px'}
                className="relative w-full"
                style={{ width: '100%', height: 'auto' }}
                onPlay={handleVideoPlay} // Pause autoplay when video plays
                onEnded={handleVideoEnd} // Resume autoplay when video ends
                loop={false} // Do not loop the video
              />
            ) : null}
          </div>
        ))}
      </Slider>
    </div>
  );
}
