import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs/promises';

const responseSchema = {
  type: 'object',
  properties: {
    numIdentified: {
      type: 'integer',
      description: 'The number of books identified in the image.',
    },
    recs: {
      type: 'array',
      description: 'A list of up to 5 recommended books based on the identified books.',
      maxItems: 5,
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'The unique identifier for the book.',
          },
          title: {
            type: 'string',
            description: 'The title of the book.',
          },
          author: {
            type: 'string',
            description: 'The author of the book.',
          },
          genres: {
            type: 'array',
            description: 'Up to 3 genres of the book.',
            maxItems: 3,
            items: { type: 'string' },
          },
          description: {
            type: 'string',
            description: 'A brief description of the book.',
          },
        },
        required: ['id', 'title', 'author', 'genres', 'description'],
      },
    },
  },
  required: ['numIdentified', 'recs'],
};

export async function getBooks(imagePath, mimeType = 'image/jpeg') {
  const imageData = await fs.readFile(imagePath, { encoding: 'base64' });
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: [
      {
        inlineData: {
          data: imageData,
          mimeType,
        },
      },
      {
        text: 'Provide the number of books identified in the image. Provide the title, author, genres, and description for up to 5 similar books based on the books in this image.',
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: responseSchema,
    },
  });

  if (!response.text) {
    throw new Error('Gemini returned an empty response.');
  }

  return JSON.parse(response.text);
}

if (process.argv[1]?.endsWith('/books.js')) {
  const imagePath = process.argv[2];

  if (!imagePath) {
    console.error('No image path provided.');
    process.exitCode = 1;
  } else {
    getBooks(imagePath)
      .then((books) => console.log(JSON.stringify(books)))
      .catch((error) => {
        console.error(error);
        console.log(JSON.stringify({ error: { message: error?.error?.message || error || 'Error calling AI model.' } }));
        process.exitCode = 1;
      });
  }
}
