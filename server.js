const express = require("express");
const cors = require("cors");
const { downloadAndClip } = require("./clip");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/clip", async (req, res) => {
  const { url, startTime, endTime } = req.body;

  if (!url || startTime == null || endTime == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await downloadAndClip(url, startTime, endTime);
    return res.json({
      message: "Clip created successfully",
      download_url: `${req.protocol}://${req.get("host")}${result.clipPath}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
});

app.listen(PORT, () => console.log(`🎬 Server running on port ${PORT}`));
