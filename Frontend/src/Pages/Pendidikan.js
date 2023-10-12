import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Font.css";

function Pendidikan() {
  const [berita, setBerita] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4004/Pendidikan")
      .then((response) => {
        setBerita(response.data);
      })
      .catch((error) => {
        console.error("Gagal mengambil data berita:", error);
      });
  }, []);

  const getSentimentColorClass = (score) => {
    if (score > 0) {
      return "btn-success";
    } else if (score < 0) {
      return "btn-danger";
    } else {
      return "btn-secondary";
    }
  };

  const getSentimentExplanation = (score) => {
    if (score > 0) {
      return "Positif";
    } else if (score < 0) {
      return "Negatif";
    } else {
      return "Netral";
    }
  };

  const cardStyle = {
    height: "200px",
    objectFit: "cover",
  };

  const titleStyle = {
    color: "black",
    transition: "color 0.3s",
    textAlign: "justify",
    fontSize: "30px",
  };

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          {berita.map((item) => (
            <div key={item.link} className="col-md-4">
              <div className="card mb-4">
                <img src={item.imgSrc} alt={item.title} className="card-img-top" style={cardStyle} />
                <div className="card-body">
                  <p className="card-text">
                    <button className={`btn ${getSentimentColorClass(item.sentiment.score)}`}>
                      {getSentimentExplanation(item.sentiment.score)}
                    </button>
                  </p>
                  <a href={item.link} style={{ textDecoration: "none" }}>
                    <h2
                      className="card-title"
                      style={titleStyle}
                      onMouseOver={(e) => (e.target.style.color = "blue")}
                      onMouseOut={(e) => (e.target.style.color = "black")}
                    >
                      {item.title}
                    </h2>
                  </a>
                  <p style={{ textAlign: "justify", fontSize: "20px" }}>{item.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Tanggal: {item.date} | Penulis: {item.author}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pendidikan;
