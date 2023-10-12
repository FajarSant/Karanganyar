import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../CSS/Font.css";

function Olahraga() {
  const [berita, setBerita] = useState([]);
  const [page, setPage] = useState(1);
  const maxPages = 5; // Batas maksimum halaman yang diizinkan

  useEffect(() => {
    // Mengambil data berita dari server backend jika halaman masih dalam batas maksimum
    if (page <= maxPages) {
      axios.get(`http://localhost:4003/Sport?page=${page}`) // Ganti dengan URL server backend Anda
        .then((response) => {
          setBerita((prevBerita) => [...prevBerita, ...response.data]); // Menggabungkan berita yang sudah ada dengan berita yang baru
        })
        .catch((error) => {
          console.error('Gagal mengambil data berita:', error);
        });
    }
  }, [page, maxPages]);

  const loadMoreBerita = () => {
    // Menambahkan nomor halaman jika halaman masih dalam batas maksimum
    if (page < maxPages) {
      setPage(page + 1);
    }
  };

  // Fungsi untuk mendapatkan kelas warna berdasarkan sentimen
  const getSentimentColorClass = (score) => {
    if (score > 0) {
      return "btn-success"; // Hijau untuk sentimen positif
    } else if (score < 0) {
      return "btn-danger"; // Merah untuk sentimen negatif
    } else {
      return "btn-secondary"; // Abu-abu untuk sentimen netral
    }
  };

  // Fungsi untuk mendapatkan penjelasan sentimen
  const getSentimentExplanation = (score) => {
    if (score > 0) {
      return "Positif"; // Penjelasan untuk sentimen positif
    } else if (score < 0) {
      return "Negatif"; // Penjelasan untuk sentimen negatif
    } else {
      return "Netral"; // Penjelasan untuk sentimen netral
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          {berita.map((item) => (
            <div key={item.id} className="col-md-4">
              <div className="card mb-4">
                <img
                  src={item.gambarURL}
                  alt={item.judul}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover", }}
                />
                <div className="card-body">
                  <p className="card-text">
                    <button
                      className={`btn ${getSentimentColorClass(
                        item.sentimen?.score // Menggunakan ?. untuk menghindari kesalahan jika sentimen tidak ada
                      )}`}
                    >
                      {getSentimentExplanation(item.sentimen?.score)} {/* Juga gunakan ?. di sini */}
                    </button>
                  </p>
                  <a href={item.beritaLink} style={{ textDecoration: "none" }}>
                    <h2
                      className="card-title"
                      style={{
                        color: "black",
                        textAlign:"justify",
                        fontSize:"30px",
                        transition: "color 0.3s",
                      }}
                      onMouseOver={(e) => (e.target.style.color = "blue")}
                      onMouseOut={(e) => (e.target.style.color = "black")}
                    >
                      {item.judul}
                    </h2>
                  </a>
                  <p style={{textAlign:"justify", fontSize:"20px"}}>{item.isi}</p>
                  <p className="card-text">
                    <small className="text-muted">
                     {item.tanggal} 
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {page < maxPages && (
          <div className="text-center">
            <button className="btn btn-primary" onClick={loadMoreBerita}>
              Muat Berita Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Olahraga;
