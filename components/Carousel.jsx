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
  const sliderRef = useRef(null);
  const playerRefs = useRef([]); // Store references to ReactPlayer instances
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(null); // Track the currently playing video

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
      stopAllVideos(); // Stop all videos when the slide changes
      setCurrentSlide(newIndex);
    },
  };

  const handleClick = (url) => {
    if (url) {
      router.push(url);
    }
  };

  const handlePlay = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickPause(); // Pause autoplay when a video is played
    }
  };

  const handleVideoEnd = (index) => {
    if (playerRefs.current[index]) {
      playerRefs.current[index].seekTo(0); // Reset video to the start
      // No need to setPlayingIndex again; let loop handle replay
      setPlayingIndex(null);
      sliderRef.current.slickPlay(); // Play autoplay
      sliderRef.current.slickNext(); // Go to next slide
    }
  };

  // Function to stop all videos
  const stopAllVideos = () => {
    setPlayingIndex(null); // Set the playing index to null to stop all videos
    playerRefs.current.forEach((player) => {
      if (player) {
        player.seekTo(0); // Reset video to the start
      }
    });
    sliderRef.current.slickPlay(); // Play autoplay
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
              <ReactPlayer
                ref={(player) => (playerRefs.current[index] = player)} // Store reference to each ReactPlayer instance
                url={media.media.url}
                playing={playingIndex === index} // Control playback based on playingIndex
                muted={false}
                width={'100%'}
                height={'240px'}
                className="relative w-full"
                style={{ width: '100%', height: 'auto' }}
                onPlay={() => handlePlay(index)}
                onEnded={() => handleVideoEnd(index)} // Reset video to the start when it ends
                loop={false} // Loop the video to play again automatically
                controls={true}
              />
            ) : media.youtube ? (
              <ReactPlayer
                ref={(player) => (playerRefs.current[index] = player)} // Store reference to each ReactPlayer instance
                url={media.youtube.url}
                playing={playingIndex === index} // Control playback based on playingIndex
                muted={false}
                width={'100%'}
                height={'240px'}
                className="relative w-full"
                style={{ width: '100%', height: 'auto' }}
                onPlay={() => handlePlay(index)}
                onEnded={() => handleVideoEnd(index)} // Reset video to the start when it ends
                loop={false} // Loop the video to play again automatically
                controls={true}
              />
            ) : null}
          </div>
        ))}
      </Slider>
    </div>
  );
}
