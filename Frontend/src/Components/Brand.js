import React from 'react';
import Brand from '../Assets/Portal_Berita.png';
import "../CSS/Font.css";

const Logo = () => {
  return (
    <div className="header-section text-center mt-1"> {/* Tambahkan class "text-center" dan "mt-5" */}
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="logo">
              <a href="index.html"><img src={Brand} alt="" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logo;
