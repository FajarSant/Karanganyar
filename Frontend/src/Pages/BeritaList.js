import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/Font.css";

function BeritaList() {
  const [berita, setBerita] = useState([]);

  useEffect(() => {
    // Mengambil data dari server scraping
    axios
      .get("https://karanganyar-b8e7.vercel.app/api/Berita")
      .then((response) => {
        setBerita(response.data);
      })
      .catch((error) => {
        console.error("Gagal mengambil data berita:", error);
      });
  }, []);

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
    <div className="container mt-5">
      <ul className="list-group">
        {berita.map((item, index) => (
          <li key={index} className="list-group-item">
            <div className="row">
              <div className="col-md-3">
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  className="img-fluid"
                  style={{ objectFit: "cover", height: "80%" }}
                />
              </div>
              <div className="col-md-9">
              <p className="card-text">
                    <button
                      className={`btn ${getSentimentColorClass(
                        item.sentiment.score
                      )}`}
                    >
                      {getSentimentExplanation(item.sentiment.score)}
                    </button>
                  </p>
                <a
                  href={item.link}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <h2
                    style={{
                      borderBottom: "none",
                      transition: "color 0.3s",
                      fontSize:"32px",
                      textAlign: "justify",

                    }}
                    onMouseOver={(e) => (e.target.style.color = "blue")}
                    onMouseOut={(e) => (e.target.style.color = "black")}
                  >
                    {item.title}
                  </h2>{" "}
                </a>
                <p style={{ textAlign: "justify", fontSize:"18px" }}>{item.description}</p>
                <div className="text-muted">
                  <p>
                    {item.date} | {item.author}{" "}
                  </p>
                </div>
                
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BeritaList;
