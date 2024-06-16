import React from 'react';
import { FacebookEmbed, InstagramEmbed, TikTokEmbed } from 'react-social-media-embed';
import ReactPlayer from 'react-player/youtube';

const getEmbedComponent = (url) => {
  if (ReactPlayer.canPlay(url)) {
    return <ReactPlayer url={url} controls />;
  }
  if (url.includes('tiktok.com')) {
    return <TikTokEmbed url={url} width="100%" />;
  }
  if (url.includes('facebook.com')) {
    return <FacebookEmbed url={url} width="100%" />;
  }

  if (url.includes('instagram.com')) {
    return <InstagramEmbed url={url} width="100%" />;
  }

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return <ReactPlayer url={url} controls width={'100%'} height={250}/>;
  } 
    return null;
};

export default getEmbedComponent;