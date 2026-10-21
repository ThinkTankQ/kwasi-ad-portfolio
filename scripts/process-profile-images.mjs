import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const sourceDirectory = process.argv[2];

if (!sourceDirectory) {
  throw new Error('Pass the directory containing the approved profile photographs.');
}

const destination = path.resolve('public/images/profile');
const images = [
  ['Q.jpeg', 'kwasi-yellow-portrait'],
  ['me also R2.jpeg', 'kwasi-monochrome-portrait'],
  ['893A3476.jpg', 'kwasi-production'],
  ['IMG_2893.JPG', 'kwasi-gdg-speaking'],
  ['GU567.jpg', 'kwasi-generation-unlimited'],
  ['IMG_1102.JPG', 'generation-unlimited-community'],
  ['ItsCaptured Images BICA 96-125.jpg', 'kwasi-bica-panel'],
  ['_2SY9963.jpg', 'kwasi-community-gathering'],
  ['FIMI0096.JPG', 'field-notes-aerial']
];
const widths = [720, 1440];

await mkdir(destination, { recursive: true });

for (const [sourceName, outputName] of images) {
  const source = path.join(sourceDirectory, sourceName);

  for (const width of widths) {
    const pipeline = sharp(source).rotate().resize({ width, withoutEnlargement: true });
    await Promise.all([
      pipeline.clone().avif({ quality: 55, effort: 6 }).toFile(path.join(destination, `${outputName}-${width}.avif`)),
      pipeline.clone().webp({ quality: 78, effort: 5 }).toFile(path.join(destination, `${outputName}-${width}.webp`)),
      pipeline.clone().jpeg({ quality: 84, progressive: true, mozjpeg: true }).toFile(path.join(destination, `${outputName}-${width}.jpg`))
    ]);
  }
}

console.log(`Processed ${images.length} approved photographs into ${destination}.`);
