import React, { useState, useEffect } from "react";

const VideoPlayer = ({ videoId }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoSource, setVideoSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const CHUNK_SIZE = 10 * 1024 * 1024; // Adjust chunk size based on your server configuration

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(videoId);
        const data = await response.json();
        setVideoUrl(data.videoUrl);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching video URL:", error);
        setError("Failed to load video"); // Set error message for display
      } finally {
        setIsLoading(false); // Ensure loading state is reset even on error
      }
    };

    fetchVideoUrl();
  }, []);

  const handleChunkLoad = async (startByte) => {
    try {
      const response = await fetch(videoUrl, {
        headers: {
          Range: `bytes=${startByte}-${startByte + CHUNK_SIZE - 1}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching video chunk");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoSource(url);
    } catch (error) {
      console.error("Error fetching video chunk:", error);
      setError("Error streaming video"); // Set error message for display
    }
  };

  const handlePlay = () => {
    let currentByte = 0;
    const handlePlayChunk = () => {
      if (currentByte >= videoUrl) {
        return; // Reached the end of the video
      }
      handleChunkLoad(currentByte);
      currentByte += CHUNK_SIZE;
      setTimeout(handlePlayChunk, 100); // Adjust interval based on network conditions
    };
    handlePlayChunk();
  };

  return (
    <div className="video-player">
      {isLoading && <p>Loading video...</p>}
      {error && <p>Error: {error}</p>} {/* Display error message if set */}
      {videoSource && (
        <video width="400" controls>
          <source
            src={videoSource}
            controls
            onPlay={handlePlay}
            type="video/avi"
          />
          Your browser does not support HTML video.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
