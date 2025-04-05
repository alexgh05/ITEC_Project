import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioFiles = [
  {
    name: 'tokyo-ambient.mp3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    name: 'newyork-hiphop.mp3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    name: 'lagos-beats.mp3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    name: 'seoul-kpop.mp3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    name: 'london-electronic.mp3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  }
];

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Delete existing files with the same names
audioFiles.forEach(file => {
  const filePath = path.join(audioDir, file.name);
  if (fs.existsSync(filePath)) {
    console.log(`Removing existing file ${file.name}...`);
    fs.unlinkSync(filePath);
  }
});

// Download each audio file
audioFiles.forEach(file => {
  const filePath = path.join(audioDir, file.name);
  
  console.log(`Downloading ${file.name}...`);
  
  const fileStream = fs.createWriteStream(filePath);
  
  https.get(file.url, response => {
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Downloaded ${file.name}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {}); // Delete the file if download failed
    console.error(`Error downloading ${file.name}: ${err.message}`);
  });
});

console.log('Audio download script started. Files will be saved to public/audio/'); 