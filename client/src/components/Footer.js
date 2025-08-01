import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer id="footer" style={{ backgroundColor: '#0021a7' }}>

    <div class="footer-top">

      <div class="container">

        <div class="row  justify-content-center">
          <div class="col-lg-6">
            <h3>NewsSnap</h3>
            <p>You can contact us in the social media handles mentioned below. We will try to answer all your 
              queries. 
            </p>
          </div>
        </div>


        <div class="social-links">
          <a href="https://github.com/Rutujachaskar/Rutujachaskar" target="blank" class="twitter"><i class="bx bxl-twitter"></i></a>
          <a href="https://www.linkedin.com/feed/" target="blank" class="linkedin"><i class="bx bxl-linkedin"></i></a>
        </div>

      </div>
    </div>

    <div class="container footer-bottom clearfix">
      <div class="copyright">
        &copy; Copyright <strong><span>NewsSnap</span></strong>. All Rights Reserved
      </div>
      <div class="credits">  Designed by <h3 >Vaishnavi Borse</h3>
      </div>
    </div>
  </footer>
  );
}
export default Footer;