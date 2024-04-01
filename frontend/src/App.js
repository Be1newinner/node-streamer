import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const [videosList, setVideosList] = useState([]);
  const [videoPath, setVideoPath] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");

  const videoPlayer = useRef(null);

  useEffect(() => {
    (async function () {
      try {
        if (!videoPath || !videoPath.endsWith(".mp4")) {
          const data = await fetch(
            "http://localhost:3000/api/videoslist" + videoPath
          );
          const response = await data.json();
          setVideosList(response);
        } else {
          const videoUrl = "http://localhost:3000/api/play" + videoPath;
          setSelectedVideo(videoUrl);
          if (videoPlayer.current) videoPlayer.current.load();
          setVideoPath("");
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [videoPath]);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {videosList.map((e, i) => {
          return (
            <span key={i} onClick={() => setVideoPath(videoPath + "/" + e)}>
              {e.replaceAll("-", " ")}
            </span>
          );
        })}
      </div>
      {selectedVideo && (
        <video width="650" controls autoPlay>
          <source src={selectedVideo} ref={videoPlayer} type="video/mp4" />
        </video>
      )}
      <div>
        <h6>Copyright by Shipsar Developers</h6>
      </div>
    </div>
  );
};

export default App;
