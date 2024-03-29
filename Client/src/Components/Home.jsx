import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import itemsData from "./items.json";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./Home.css";

const Home = () => {
  const [highResLoaded1, setHighResLoaded1] = useState(false);
  const [highResLoaded2, setHighResLoaded2] = useState(false);
  const [highResLoaded3, setHighResLoaded3] = useState(false);

  useEffect(() => {
    const img1 = new Image();
    img1.onload = () => {
      setHighResLoaded1(true);
    };
    img1.src = "/pic-1.png";

    const img2 = new Image();
    img2.onload = () => {
      setHighResLoaded2(true);
    };
    img2.src = "/pic-3.png";

    const img3 = new Image();
    img3.onload = () => {
      setHighResLoaded3(true);
    };
    img3.src = "/pic-2.png";
  }, []);

  const handleClick = (sectionId) => {
    return () => {
      const shopLink = "/shop"; // Replace with the actual path to your '/shop' page
      const targetUrl = shopLink + "#" + sectionId;
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 300); // Adjust the delay time as needed (in milliseconds)
    };
  };

  const allItems = Object.values(itemsData).flatMap((category) => category);



  return (
    <>
      <div className="dotted-bg">
        <div className="pic-wrapper row">
          <div className="pic-container basics col-4">
            {highResLoaded1 ? (
              <Link to="/shop" onClick={handleClick("basics")}>
                {" "}
                <img
                  rel="preload"
                  as="image"
                  fetchpriority="high"
                  src="/pic-1.png"
                  alt="pic-1"
                  id="pic-1"
                  className="img"
                />
              </Link>
            ) : (
              <img src="/pic-1_low.png" alt="pic-1 low res"></img>
            )}

            <div className="button">
              <h3>-BASICS-</h3>
              <Link to="/shop">
                <button
                  className="btn btn-outline-light"
                  onClick={handleClick("basics")}
                >
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
          <div className="pic-container melts col-4">
            {highResLoaded2 ? (
              <Link to="/shop" onClick={handleClick("melts")}>
                <img
                  rel="preload"
                  as="image"
                  fetchpriority="high"
                  src="/pic-3.png"
                  alt="pic-2"
                  id="pic-3"
                  className="img"
                />
              </Link>
            ) : (
              <img src="/pic-3_low.png" alt="pic-1 low res"></img>
            )}
            <div className="button">
              <h3>-MELTS-</h3>
              <Link to="/shop">
                <button
                  className="btn btn-outline-light"
                  onClick={handleClick("melts")}
                >
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
          <div className="pic-container kints col-4">
            {highResLoaded3 ? (
              <Link to="/shop" onClick={handleClick("kints")}>
                <img
                  src="/pic-2.png"
                  rel="preload"
                  as="image"
                  fetchpriority="high"
                  alt="pic-2"
                  id="pic-2"
                  className="img"
                />
              </Link>
            ) : (
              <img src="/pic-2_low.png" alt="pic-1 low res"></img>
            )}
            <div className="button">
              <h3>-KINTS-</h3>
              <Link to="/shop">
                <button
                  className="btn btn-outline-light"
                  onClick={handleClick("kints")}
                >
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        
        <div id="carouselExample" class="carousel carousel-dark slide" >
          <div class="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              class="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>

          <div class="carousel-inner">
            <div class="carousel-item active" >
              <img src="/about-pic.png" class="d-block w-100" alt="img1"></img>
              <div class="carousel-caption d-none d-md-block">
                <h2>-ABOUT-</h2>
                <p>Welcome to Tsuki, where <b>"Tsuki [つき]" meaning 'moon'</b> in
              Japanese, symbolizes the essence of our brand – a celestial,
              timeless beauty that illuminates the night sky. We believe that
              fashion and home products should not only be stylish but also
              ethically made. From the cotton fields to the final stitch, we
              prioritize ethical sourcing, fair labor, and environmental
              consciousness.{" "}</p>
              </div>
            </div>
            <div class="carousel-item" >
              <img src="/carft.png" class="d-block w-100" alt="img2"></img>
              <div class="carousel-caption d-none d-md-block">
                <h2>-CRAFTSMANSHIP-</h2>
                <p>At Tsuki, we believe that fashion and home products should not
              only be stylish but also ethically made.From the cotton fields to
              the final stitch, we prioritize ethical sourcing, fair labor, and
              environmental consciousness.Our unisex clothing and home goods are
              a testament to our commitment to sustainable and responsible
              manufacturing practices.</p>
              </div>
            </div>
            <div class="carousel-item">
              <img
                src="/shop/basic-banner.png"
                class="d-block w-100"
                alt="img3"
              ></img>
              <div class="carousel-caption d-none d-md-block">
                <h2>-TSUKI COMMUNITY-</h2>
                <p>We invite you to explore our collections, where fashion meets
              conscience, and where every purchase becomes a vote for a better,
              more sustainable future. Join the Tsuki community and embrace the
              journey of self-expression, ethical living, and the artistry of
              moonlit stories.</p>
              </div>
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>

        <div id="more-items-homepage" className="more-items-cover">
          <div className="more-items-text">
            <h4>- Explore Our Collection -</h4>
          </div>
          <div className="more-items">
            {allItems
              .sort(() => Math.random() - 0.5)
              .slice(0, 5)
              .map((item) => (
                <div className="product-card" id={item.id}>
                  <Link
                    to={`/shop/product/showcase?id=${item.id}`}
                    className="view-item-button"
                  >
                    <div
                      className="product-status-chip"
                      style={{opacity: item.inStock ? 0 : 1, }}>
                      <h6>SOLD OUT</h6>
                    </div>

                    <div className="product-card-image">
                      <Link
                        to={`/shop/product/showcase?id=${item.id}`}
                      >
                        <LazyLoadImage
                          effect="blur"
                          src={item.img}
                          alt="product-card-view"
                        />
                      </Link>
                    </div>

                    <div className="quick-view">
                      <h1>QUICK VIEW</h1>
                    </div>
                    <div className="product-card-text">
                      <h3>{item.name}</h3>
                      <Link
                        to={`/shop/product/showcase?id=${item.id}`}
                        className="view-item-button"
                      >
                        - View Item -
                      </Link>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>

        <div className="bottom">
          <div className="help-box">
            <div className="help-text">
              <p>
                As always, we’re here to help, so please get in touch if you
                have any questions or concerns about our products. Contact our
                customer service team at <b>hello@tsuki.market</b>
              </p>
            </div>
            <div className="help-img">
              <LazyLoadImage
                effect="blur"
                src="/bottom.png"
                alt=""
                loading="lazy"
              />
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default Home;
