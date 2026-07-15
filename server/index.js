import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getBooks } from './books.js';

const app = express();

const __dirname = import.meta.dirname;
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
const upload = multer({ dest: '/tmp/uploads' });

app.use(cors());
app.use(express.json());
app.use(express.static(clientBuildPath));

app.post('/book-recs', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { message: 'A photo is required.' } });
  }

  try {
    const books = await getBooks(req.file.path, req.file.mimetype);
    res.json(books);
  } catch (error) {
    console.error('Error calling Gemini:', error);
    res.status(error.error.code || 500).json({
      error: { message: error.error.message || 'Error calling Gemini.' },
    });
  } finally {
    fs.unlink(req.file.path, () => {});
  }
});

app.use((req, res, next) => {
  if (req.method === 'GET') {
    return res.sendFile(path.join(clientBuildPath, 'index.html'));
  }
  next();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
