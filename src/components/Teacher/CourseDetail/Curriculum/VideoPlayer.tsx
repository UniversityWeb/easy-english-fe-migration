import React, { memo } from 'react';

const VideoPlayer = memo(({ url, type }) => {
  if (!url) return null;

  if (type === 'YouTube') {
    const extractYouTubeId = (url) => {
      if (!url) return '';
      const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : '';
    };

    const videoId = extractYouTubeId(url);
    return (
      <iframe
        width="100%"
        height="450"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      />
    );
  }

  return (
    <video width="100%" height="450" controls>
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;