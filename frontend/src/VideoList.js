import React, { useState, useEffect } from 'react';

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch video data from your server API (endpoint to be created later)
  }, []); // Run effect only once on component mount

  const handleVideoClick = (video) => {
    // Update state to handle selected video for playback
  };

  return (
    <div className="video-list">
      <h2>Videos</h2>
      {videos.map((video) => (
        <div key={video.id} className="video-item" onClick={() => handleVideoClick(video)}>
          <img src={video.thumbnailUrl} alt={video.title} />
          <h3>{video.title}</h3>
          <p>{video.description}</p>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
