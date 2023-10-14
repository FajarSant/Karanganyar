const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const Sentiment = require('sentiment');


const app = express();
const port = 4001;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Rute untuk URL http://localhost:4001/list
app.get("/list", async (req, res) => {
  try {
    const url = "https://soloraya.solopos.com/karanganyar"; // Ganti dengan URL sumber berita Anda

    const response = await axios.get(url);

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const newsList = [];

      $(".item").each((index, element) => {
        const imgSrc = $(element).find(".img img").attr("src");
        const category = $(element).find(".news-cat").text();
        const title = $(element).find(".title a").text();
        const link = $(element).find(".title a").attr("href");
        const description = $(element).find(".text").text();
        const date = $(element).find(".date").text().trim();
        const author = $(element).find(".author").text().trim(); // Mengambil teks author dan menghapus spasi di awal dan akhir

        // Analisis sentimen pada deskripsi berita
        const sentimentAnalysis = new Sentiment();
        const sentimentResult = sentimentAnalysis.analyze(description);

        newsList.push({
          imgSrc,
          category,
          title,
          link,
          description,
          date,
          author,
          sentiment: sentimentResult,
        });
      });

      res.json(newsList);
    } else {
      res.status(500).json({ error: "Gagal melakukan GET request" });
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});
// Rute untuk URL http://localhost:4001/Berita
app.get('/Berita', async (req, res) => {
  try {
    const url = 'https://solo.tribunnews.com/karanganyar-mantap'; // Ganti dengan URL sumber berita Anda

    // Mengambil data HTML dari URL menggunakan Axios
    const response = await axios.get(url);

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const newsList = [];

      // Loop melalui semua elemen berita
      $('.mr140').each((index, element) => {
        const title = $(element).find('h3 a').text();
        const description = $(element).find('h4').text();
        const link = $(element).find('h3 a').attr('href');
        const date = $(element).find('div.grey time').text();
        const imgSrc = $(element).find('div.fr a img').attr('src'); // Mengambil URL gambar dari elemen yang diberikan

        // Menambahkan data berita ke dalam array
        newsList.push({
          title,
          description,
          link,
          date,
          imgSrc: link, // Menggunakan atribut link sebagai imgSrc
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

app.get('/HotNews', (req, res) => {
  const url = 'https://www.detik.com/tag/bupati-karanganyar?tag_from=karanganyar';

  axios.get(url)
    .then((response) => {
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
    })
    .catch((error) => {
      console.error('Gagal mengambil halaman web:', error);
      res.status(500).json({ error: 'Terjadi kesalahan' });
    });
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
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
