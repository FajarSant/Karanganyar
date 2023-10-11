import React, { useState, useEffect } from 'react';
import "../CSS/Font.css";

function NewsList() {
  const [news, setNews] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const apiKey = '5a424e4224f94f5998bbbdf2c53c938e';
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=id&apiKey=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setNews(data.articles);
        setLoadingImages(false);
      })
      .catch((error) => {
        console.error('Gagal mengambil data berita: ', error);
      });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
          <div className="news-container">
            <h1 className="mb-4 text-center">Hot News</h1>
            <ul className="list-group">
              {news.map((article, index) => (
                <li key={index} className="list-group-item">
                  <div className="news-item">
                    <div className="news-image-container">
                      {/* Apply the 'loading' class if images are loading */}
                      <img
                        className={`news-image ${loadingImages ? 'loading' : 'loaded'}`}
                        src={article.urlToImage}
                        alt={article.title}
                      />
                      {/* Display the title as a link */}
                      <a className="news-link" href={article.url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                      </a>
                    </div>
                    </div>
                </li>
              ))}
            </ul>
          </div>
  
      </div>
    </div>
  );
}

export default NewsList;
