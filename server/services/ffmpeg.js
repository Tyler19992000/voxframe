const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Allow overriding ffmpeg binary path via env
if (process.env.FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
}

/**
 * Checks whether ffmpeg is available on the system.
 * Returns { available: boolean, error?: string }
 */
function checkFfmpeg() {
  return new Promise((resolve) => {
    ffmpeg.getAvailableFormats((err) => {
      if (err) {
        resolve({
          available: false,
          error:
            'FFmpeg not found. Please install FFmpeg (https://ffmpeg.org/download.html) and ensure it is in your PATH, or set FFMPEG_PATH in your .env file.',
        });
      } else {
        resolve({ available: true });
      }
    });
  });
}

/**
 * Gets the duration of an audio file in seconds.
 */
function getAudioDuration(audioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration);
    });
  });
}

/**
 * Renders a video from images and audio.
 *
 * @param {object} opts
 * @param {string[]} opts.imagePaths - Absolute paths to images in order
 * @param {number[]} opts.durations - Duration in seconds for each image
 * @param {string} opts.audioPath - Absolute path to audio file
 * @param {string} opts.outputPath - Absolute path for output MP4
 * @param {boolean} opts.watermark - Whether to add watermark
 * @param {boolean} opts.fade - Whether to add crossfade transitions
 * @param {string} [opts.bgColor='black'] - Background color for letterboxing
 * @param {function} opts.onProgress - Called with 0-100 progress
 */
async function renderVideo(opts) {
  const { imagePaths, durations, audioPath, outputPath, watermark, fade, bgColor = 'black', onProgress } = opts;

  const ffmpegCheck = await checkFfmpeg();
  if (!ffmpegCheck.available) throw new Error(ffmpegCheck.error);

  return new Promise((resolve, reject) => {
    const cmd = ffmpeg();

    // Add each image as an input with its duration
    imagePaths.forEach((imgPath, i) => {
      cmd.addInput(imgPath).inputOptions([`-loop 1`, `-t ${durations[i]}`]);
    });

    // Add audio
    cmd.addInput(audioPath);

    // Build filter_complex for scaling each image to 1920x1080 with letterbox
    const filters = [];
    const totalImages = imagePaths.length;

    // Scale + pad each image to 1920x1080
    imagePaths.forEach((_, i) => {
      filters.push(
        `[${i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,` +
        `pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=${bgColor},setsar=1[v${i}]`
      );
    });

    let concatInput;

    if (fade && totalImages > 1) {
      // Build crossfade chain
      const fadeDuration = 0.3;
      let prev = `[v0]`;
      for (let i = 1; i < totalImages; i++) {
        const out = i < totalImages - 1 ? `[cf${i}]` : `[vout]`;
        // offset = sum of all previous durations minus fade overlap
        const offset = durations.slice(0, i).reduce((a, b) => a + b, 0) - fadeDuration * i;
        filters.push(`${prev}[v${i}]xfade=transition=fade:duration=${fadeDuration}:offset=${Math.max(0, offset)}${out}`);
        prev = `[cf${i}]`;
      }
      if (totalImages === 1) {
        // rename single stream
        filters.push(`[v0]copy[vout]`);
      }
      concatInput = '[vout]';
    } else {
      // Simple concat
      const concatInputs = imagePaths.map((_, i) => `[v${i}]`).join('');
      filters.push(`${concatInputs}concat=n=${totalImages}:v=1:a=0[vout]`);
      concatInput = '[vout]';
    }

    // Watermark overlay
    if (watermark) {
      filters.push(
        `${concatInput}drawtext=text='Made with VoxFrame':fontcolor=white@0.6:fontsize=28:x=w-tw-20:y=h-th-20[vfinal]`
      );
      concatInput = '[vfinal]';
    }

    const audioIndex = totalImages; // audio is the last input

    cmd
      .complexFilter(filters)
      .outputOptions([
        `-map ${concatInput}`,
        `-map ${audioIndex}:a`,
        '-c:v libx264',
        '-preset fast',
        '-crf 22',
        '-c:a aac',
        '-b:a 192k',
        '-r 30',
        '-pix_fmt yuv420p',
        '-shortest',
        '-movflags +faststart',
      ])
      .output(outputPath)
      .on('progress', (p) => {
        if (onProgress && p.percent != null) {
          onProgress(Math.min(99, Math.round(p.percent)));
        }
      })
      .on('end', () => {
        if (onProgress) onProgress(100);
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(new Error(`FFmpeg error: ${err.message}`));
      })
      .run();
  });
}

module.exports = { checkFfmpeg, getAudioDuration, renderVideo };
