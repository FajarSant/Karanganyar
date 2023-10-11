import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import '../CSS/TopBar.css';
import '../CSS/Font.css';

const Topbar = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // State untuk tanggal dan waktu

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date()); // Perbarui tanggal dan waktu setiap detik
    }, 1000);
    
    return () => {
      clearInterval(intervalId); // Hentikan interval saat komponen unmount
    };
  }, []);

  const formattedDate = currentDate.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',

  });

  return (
    <div className="topbar">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-6 d-none d-sm-block">
            <div className="topsocial">
              <a href="#" data-toggle="tooltip" data-placement="bottom" title="Facebook">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" data-toggle="tooltip" data-placement="bottom" title="Twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" data-toggle="tooltip" data-placement="bottom" title="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
          <div className="col-lg-4 d-none d-md-block">
            <div className="topmenu text-center">
              <ul className="list-inline">
                <li className="list-inline-item">
                  <a href="https://link-ke-diskominfo-pembkab" className="link-normal">
                    DISKOMINFO
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="https://link-ke-diskominfo-karanganyar" className="link-normal">
                    PEMKAB Karanganyar
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="https://link-untuk-write-for-us" className="link-normal">
                    Write for us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
            <div className="topsearch text-right">
              {/* Tampilkan hari dan tanggal di sini */}
              <p>{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
