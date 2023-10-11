import React, { useEffect } from 'react';
import "../CSS/Font.css";
import BeritaList from '../Pages/BeritaList';
import HotNews from '../Pages/ListNews';

function Home() {
  // Menggunakan useEffect
  useEffect(() => {
    // Kode efek samping di sini
  }, []);

  return (
    <div className="container-News">
      <div className="row">
        <div className="col-md-9">
            <BeritaList/>
        </div>

        <div className="col-md-3">
            <HotNews/>
        </div>
      </div>
    </div>
  );
}

export default Home;
