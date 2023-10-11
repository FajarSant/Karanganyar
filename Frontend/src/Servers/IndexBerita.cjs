const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 4004;

// Middleware untuk mengizinkan permintaan lintas domain (CORS), Anda dapat mengonfigurasi ini sesuai kebutuhan
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Endpoint untuk mendapatkan data dari URL sumber berita
app.get('/LIST', async (req, res) => {
  try {
    const url = 'https://jateng.tribunnews.com/karanganyar-maju'; // Ganti dengan URL sumber berita Anda

    // Mengambil data HTML dari URL menggunakan Axios
    const response = await axios.get(url);

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const newsList = [];

      // Loop melalui semua elemen berita
      $('.row').each((index, element) => {
        const title = $(element).find('h3.title a').text();
        const description = $(element).find('.text').text();
        const link = $(element).find('h3.title a').attr('href');
        const date = $(element).find('li.date a').text();
        const author = $(element).find('li.author a').text();
        const imgSrc = $(element).find('img').attr('src');

        // Menambahkan data berita ke dalam array
        newsList.push({
          title,
          description,
          link,
          date,
          author,
          imgSrc,
        });
      });

      // Mengirim data berita sebagai respons JSON
      res.json(newsList);
    } else {
      res.status(500).json({ error: 'Gagal melakukan GET request' });
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});

// Mulai server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
