const express = require("express");
const path = require("path");
const fs = require("fs");
const pm2 = require("pm2"); // Requires PM2 installed globally
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000; // Set a port for server listening
const corsOptions = {
  origin: "http://localhost:3001", // Replace with your client domain
  optionsSuccessStatus: 200, // Optional: Code to send for preflight requests
};

app.use(cors(corsOptions)); // Apply CORS middleware to all routes

// Serve static files from the 'public' directory (for placeholder HTML)
app.use(express.static(path.join(__dirname, "frontend/build")));

const storagePath = path.join(__dirname, "storage");
// const CHUNK_SIZE = 10 * 1024 * 1024; // Adjust chunk size based on your needs (e.g., 10 MB)

// Serve video files from the 'storage' directory (placeholder)
app.all("/api/videoslist/:path?", (req, res) => {
  try {
    const path = req.params.path || "";
    const files = fs.readdirSync(storagePath + "/" + path);
    res.send(JSON.stringify(files));
    res.end();
  } catch (error) {
    console.error("Error reading storage directory:", error);
  }
  res.end();
});

app.get("/test", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.all("/api/play/:path/:file", (req, res) => {
  const videoPath = req.params.path;
  const videoFile = `${req.params.file}`;
  // const filePath = "media2.mp4";
  const filePath = path.join(storagePath, videoPath, videoFile);

  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range Header!");
  }

  const videoSize = fs.statSync(filePath).size;
  const CHUNK_SIZE = 10 ** 6;

  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": `bytes`,
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(filePath, { start, end });

  videoStream.pipe(res);
});

// pm2.start("server.js", { name: "video-streamer" });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
