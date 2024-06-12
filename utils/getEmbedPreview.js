import React from 'react';
import { FacebookEmbed, InstagramEmbed, TikTokEmbed } from 'react-social-media-embed';
import ReactPlayer from 'react-player/youtube';

const getEmbedPreview = (url) => {
  if (url.includes('facebook.com')) {
    return <FacebookEmbed url={url} />;
  } else if (url.includes('instagram.com')) {
    return <InstagramEmbed url={url} />;
  } else if (url.includes('tiktok.com')) {
    return <div className="flex justify-center w-full max-w-[350px] overflow-hidden">
      <TikTokEmbed url={url} width={"100%"}/>
      </div>;
  } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return <ReactPlayer url={url} controls width={'100%'} height={200}/>;
  } else {
    return null;
  }
};

export default getEmbedPreview;