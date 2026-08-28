import sharp from 'sharp';

const source = 'assets/src/hero-notebook.png';
await Promise.all([
  sharp(source).resize(1280, 853, { fit: 'inside' }).avif({ quality: 58 }).toFile('public/hero-notebook-1280.avif'),
  sharp(source).resize(1280, 853, { fit: 'inside' }).webp({ quality: 82 }).toFile('public/hero-notebook-1280.webp'),
  sharp(source).resize(768, 512, { fit: 'inside' }).webp({ quality: 80 }).toFile('public/hero-notebook-768.webp'),
]);
