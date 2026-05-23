const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const sharp = require('sharp');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;

const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/find-video-loop.js <video-path>');
  process.exit(1);
}

async function main() {
  const probe = execFileSync(
    ffprobePath,
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'json', input],
    { encoding: 'utf8' },
  );
  const duration = Number(JSON.parse(probe).format.duration);
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error('Could not read video duration');
  }

  const sampleFps = 10;
  const windowSeconds = 1;
  const windowSize = sampleFps * windowSeconds;
  const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'skr-loop-'));
  const framePattern = path.join(tempDir, 'frame-%05d.png');

  execFileSync(
    ffmpegPath,
    ['-hide_banner', '-loglevel', 'error', '-i', input, '-vf', `fps=${sampleFps}`, framePattern],
    { stdio: 'inherit' },
  );

  const frameFiles = (await fsp.readdir(tempDir))
    .filter((file) => file.endsWith('.png'))
    .sort();

  if (frameFiles.length < windowSize * 2) {
    throw new Error('Not enough sampled frames to estimate a loop point');
  }

  const prepare = async (fileName) => {
    const raw = await sharp(path.join(tempDir, fileName))
      .resize(32, 32, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer();
    return raw;
  };

  const prepared = [];
  for (const file of frameFiles) {
    prepared.push(await prepare(file));
  }

  const diffBetweenWindows = (startA, startB) => {
    let total = 0;
    let count = 0;
    for (let offset = 0; offset < windowSize; offset += 1) {
      const a = prepared[startA + offset];
      const b = prepared[startB + offset];
      for (let i = 0; i < a.length; i += 1) {
        total += Math.abs(a[i] - b[i]);
        count += 1;
      }
    }
    return total / count;
  };

  let bestIndex = windowSize;
  let bestScore = Infinity;

  for (let candidate = windowSize; candidate <= prepared.length - windowSize; candidate += 1) {
    const score = diffBetweenWindows(0, candidate);
    if (score < bestScore) {
      bestScore = score;
      bestIndex = candidate;
    }
  }

  const loopSeconds = bestIndex / sampleFps;
  const rounded = Math.round(loopSeconds * 10) / 10;

  const result = {
    input,
    durationSeconds: Math.round(duration * 1000) / 1000,
    sampleFps,
    windowSeconds,
    estimatedLoopSeconds: rounded,
    estimatedLoopFrame: bestIndex,
    similarityScore: Math.round(bestScore * 100) / 100,
    sampledFrames: prepared.length,
  };

  console.log(JSON.stringify(result, null, 2));

  await fsp.rm(tempDir, { recursive: true, force: true });

  return result;
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});