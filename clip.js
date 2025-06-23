const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const ytdlp = require("yt-dlp-exec");
const ffmpeg = require("fluent-ffmpeg");

const OUTPUT_DIR = path.join(__dirname, "public");

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

async function downloadAndClip(url, startTime, endTime) {
  const id = uuidv4().slice(0, 8);
  const fullVideoPath = path.join(OUTPUT_DIR, `full_${id}.mp4`);
  const clipPath = path.join(OUTPUT_DIR, `clip_${id}.mp4`);

  // Step 1: Download video using yt-dlp
  await ytdlp(url, {
    output: fullVideoPath,
    format: "bestvideo+bestaudio/best",
  });

  // Step 2: Clip the segment using ffmpeg
  return new Promise((resolve, reject) => {
    const duration = endTime - startTime;
    ffmpeg(fullVideoPath)
      .setStartTime(startTime)
      .duration(duration)
      .output(clipPath)
      .on("end", () => {
        resolve({ clipPath: `/clip_${id}.mp4` });
      })
      .on("error", reject)
      .run();
  });
}

module.exports = { downloadAndClip };
