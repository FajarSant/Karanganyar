import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import Sentiment from 'sentiment';
import { send } from '@vercel/node'; // Import modul send dari Vercel

const app = express();
const port = 4003;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/HotNews', (req, res) => {
  const url = 'https://www.detik.com/tag/bupati-karanganyar?tag_from=karanganyar';

  axios.get(url)
    .then(async (response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      
      const beritaElements = $('.l_content article');

      const beritaData = [];

      const sentiment = new Sentiment();

      beritaElements.each((index, element) => {
        const beritaLink = $(element).find('a').attr('href');
        const judul = $(element).find('h2.title').text();
        const tanggal = $(element).find('.date').text();
        const isi = $(element).find('p').text();

        const gambarURL = $(element).find('span.ratiobox_content img').attr('src');

        const analisisDeskripsi = sentiment.analyze(isi);

        beritaData.push({
          judul,
          tanggal,
          isi,
          beritaLink,
          gambarURL,
          sentimen: analisisDeskripsi,
        });
      });

      // Menggunakan modul send untuk mengirim respons JSON
      send(res, 200, beritaData);
    })
    .catch((error) => {
      console.error('Gagal mengambil halaman web:', error);
      // Menggunakan modul send untuk mengirim respons kesalahan
      send(res, 500, { error: 'Terjadi kesalahan' });
    });
});

app.listen(port, () => {
  console.log(`Server backend is running on port ${port}`);
});
