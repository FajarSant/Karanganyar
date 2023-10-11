const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const Sentiment = require('sentiment');



const app = express();
const port = 4001;

// Rute untuk URL http://localhost:4001/list

app.get('/HotNews', async (req, res) => {
  const url = 'https://www.detik.com/tag/bupati-karanganyar?tag_from=karanganyar';

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Ubah selektor untuk mencari elemen-elemen berita
    const beritaElements = $('.l_content article');

    const beritaData = [];

    // Inisialisasi pustaka analisis sentimen
    const sentiment = new Sentiment();

    beritaElements.each((index, element) => {
      const beritaLink = $(element).find('a').attr('href');
      const judul = $(element).find('h2.title').text();
      const tanggal = $(element).find('.date').text();
      const isi = $(element).find('p').text();

      // Menambahkan kode HTML untuk elemen gambar di sini
      const gambarURL = $(element).find('span.ratiobox_content img').attr('src');

      // Analisis sentimen pada deskripsi berita
      const analisisDeskripsi = sentiment.analyze(isi);

      beritaData.push({
        judul,
        tanggal,
        isi,
        beritaLink,
        gambarURL,
        sentimen: analisisDeskripsi, // Menambahkan hasil analisis sentimen ke data berita
      });
    });

    res.json(beritaData);
  } catch (error) {
    console.error('Gagal mengambil halaman web:', error);
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});



// Fungsi untuk melakukan scraping berita dari URL tertentu
const scrapeBerita = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Ubah selektor untuk mencari elemen-elemen berita
    const beritaElements = $('.box-list-news'); // Sesuaikan dengan struktur HTML yang sesuai

    const beritaData = [];

    beritaElements.each((index, element) => {
      const beritaLink = $(element).find('a').attr('href');
      const judul = $(element).find('.title h2').text();
      const tanggal = $(element).find('.time').text();
      const isi = $(element).find('.desk').text();
      const gambarURL = $(element).find('.list-img img').attr('data-original');

      beritaData.push({
        judul,
        tanggal,
        isi,
        beritaLink,
        gambarURL,
      });
    });

    return beritaData;
  } catch (error) {
    console.error('Gagal mengambil halaman web:', error);
    throw error;
  }
};
// Rute untuk URL http://localhost:4001/Sport
app.get('/Sport', async (req, res) => {
  try {
    const page = req.query.page || 1; // Mengambil parameter 'page' dari permintaan, default ke halaman 1
    const perPage = 10; // Jumlah berita per halaman

    // Menghitung indeks awal dan akhir untuk mengambil berita berdasarkan halaman
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    const url = 'https://karanganyar.inews.id/indeks/olahraga/all'; // URL "Berita Lainnya"

    const beritaData = await scrapeBerita(url);

    // Mengambil berita berdasarkan halaman yang dipilih
    const beritaPerPage = beritaData.slice(startIndex, endIndex);

    res.json(beritaPerPage);
  } catch (error) {
    console.error('Gagal mengambil data berita:', error);
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});

// Rute untuk URL http://localhost:4001/Sport/More
app.get('/Sport/More', async (req, res) => {
  try {
    const url = 'https://karanganyar.inews.id/indeks/olahraga/all/24'; // URL "Berita Lainnya"

    const beritaData = await scrapeBerita(url);

    res.json(beritaData);
  } catch (error) {
    console.error('Gagal mengambil data berita selanjutnya:', error);
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});
// Rute untuk URL http://localhost:4001/Pendidikan
app.get('/Pendidikan', async (req, res) => {
  const url = 'https://www.solopos.com/tag/pendidikan-karanganyar';

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const breakingNewsItems = $('.sp-list-breaking .item');

    const beritaData = [];

    breakingNewsItems.each((index, element) => {
      const imgSrc = $(element).find('.img img').attr('src');
      const category = $(element).find('.news-cat').text();
      const title = $(element).find('.title a').text();
      const link = $(element).find('.title a').attr('href');
      const description = $(element).find('.text').text();
      const date = $(element).find('.date ').text();
      const author = $(element).find('.author').text();

      // Analisis sentimen pada deskripsi berita
      const sentimentAnalysis = new Sentiment();
      const sentimentResult = sentimentAnalysis.analyze(description);

      // Simpan data berita dalam objek dengan analisis sentimen
      const berita = {
        imgSrc,
        category,
        title,
        link,
        description,
        date,
        author,
        sentiment: sentimentResult,
      };

      beritaData.push(berita);
    });

    res.json(beritaData);
  } catch (error) {
    console.error('Gagal mengambil halaman web:', error);
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});
// Rute untuk URL http://localhost:4001/Pertanian
app.get('/Pertanian', async (req, res) => {
  const url = 'https://www.solopos.com/tag/pertanian-karanganyar';

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const breakingNewsItems = $('.sp-list-breaking .item');

    const beritaData = [];

    breakingNewsItems.each((index, element) => {
      const imgSrc = $(element).find('.img img').attr('src');
      const category = $(element).find('.news-cat').text();
      const title = $(element).find('.title a').text();
      const link = $(element).find('.title a').attr('href');
      const description = $(element).find('.text').text();
      const date = $(element).find('.date ').text();
      const author = $(element).find('.author').text();

      // Analisis sentimen pada deskripsi berita
      const sentimentAnalysis = new Sentiment();
      const sentimentResult = sentimentAnalysis.analyze(description);

      // Simpan data berita dalam objek dengan analisis sentimen
      const berita = {
        imgSrc,
        category,
        title,
        link,
        description,
        date,
        author,
        sentiment: sentimentResult,
      };

      beritaData.push(berita);
    });

    res.json(beritaData);
  } catch (error) {
    console.error('Gagal mengambil halaman web:', error);
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
