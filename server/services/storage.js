/**
 * Local filesystem storage service.
 * Interface designed to be swappable with S3/R2:
 *   saveFile(buffer, filename, folder) → url
 *   deleteFile(filename, folder) → void
 *   getFilePath(filename, folder) → absolute path
 */
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');

function getFilePath(filename, folder = 'uploads') {
  return path.join(BASE_DIR, folder, filename);
}

function getFileUrl(filename, folder = 'uploads') {
  // Returns a relative URL served by Express static middleware
  return `/${folder}/${filename}`;
}

async function saveFile(buffer, filename, folder = 'uploads') {
  const dir = path.join(BASE_DIR, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  await fs.promises.writeFile(filepath, buffer);
  return getFileUrl(filename, folder);
}

async function deleteFile(filename, folder = 'uploads') {
  const filepath = path.join(BASE_DIR, folder, filename);
  if (fs.existsSync(filepath)) {
    await fs.promises.unlink(filepath);
  }
}

module.exports = { saveFile, deleteFile, getFilePath, getFileUrl };
