import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from "react-router-dom";
import './Collection.css'
import { ToastContainer } from "react-toastify";

const Collecton = () => {

  return (
    <>
    <ToastContainer/>
      <div className="collection-body">
        <div className="head">
            <h1>-Our Collections-</h1>
        </div>
      <div className="basics" id='basics'>
        <div className="banner row">
          <div className="banner-text banner-basic col-6">
          <div className="banner-text-above-btn"><p>basics.</p></div>
          <Link to="/shop/product?category=basics">-See More-</Link>
          </div>
          <div className="banner-img col-6">
            <img src="/shop/basic-banner.png" alt="basic-banner" decoding="asycn" fetchpriority="high"/>
          </div>
        </div>
        <div className="product-grid">
            <div className="product-card col-4">
                <div className="product-status-chip" style={{ opacity: 0 }}>
                  <h6>SOLD OUT</h6>
                </div>
                <div className="product-card-image"><Link to="/shop/product/showcase?id=b-2"><LazyLoadImage effect="blur" src="/shop/k-cor-cap.png" alt="img for card" loading='lazy'/></Link></div>
                <div className="quick-view">      <h1>QUICK VIEW</h1>      </div>
                <div className="product-card-text"><h3>Corduroy Tsuki Cap</h3><Link to="/shop/product/showcase?id=b-2">VIEW ITEM</Link></div>
            </div>
            <div className="product-card col-4">
            <div className="product-status-chip" style={{ opacity: 0 }}>
                  <h6>SOLD OUT</h6>
              </div>
            <div className="product-card-image"><Link to="/shop/product/showcase?id=b-4"><LazyLoadImage effect="blur" src="/shop/basic-2.png" alt="img for card" loading='lazy'/></Link></div>
            <div className="quick-view">      <h1>QUICK VIEW</h1>      </div>
            <div className="product-card-text"><h3>夕焼け Sunset Glow Sweatshirt</h3><Link to="/shop/product/showcase?id=b-4">VIEW ITEM</Link></div>
            </div>
            <div className="product-card col-4">
            <div className="product-status-chip" style={{ opacity: 0 }}>
                  <h6>SOLD OUT</h6>
                </div>
            <div className="product-card-image"><Link to="/shop/product/showcase?id=b-1"><LazyLoadImage effect="blur" src="/shop/basic-3.png" alt="img for card" loading='lazy'/></Link></div>
            <div className="quick-view">      <h1>QUICK VIEW</h1>      </div>
            <div className="product-card-text"><h3>Embroidered Logo T-shirt</h3><Link to="/shop/product/showcase?id=b-1">VIEW ITEM</Link></div>
            </div>
        </div>

      </div>

      <div className="melts" id='melts'>
      <div className="banner row">
        <div className="banner-text banner-melts col-6">
          <div className="banner-text-above-btn"><p>melts.</p></div>
        <Link to="/shop/product?category=melts">-See More-</Link>
        </div>
        <div className="banner-img col-6">
          <img src="/shop/melts-banner.png" alt="melts-banner" loading='lazy'/>
        </div>
      </div>
      <div className="product-grid">
    <div className="product-card col-4">
    <div className="product-status-chip" style={{ opacity: 0 }}>
                  <h6>SOLD OUT</h6>
                </div>
        <div className="product-card-image">
            <Link to="/shop/product/showcase?id=m-1">
                <LazyLoadImage effect="blur" src="/shop/melt-sweat.png" alt="img for card" loading='lazy' />
            </Link>
        </div>
        <div className="quick-view">
            <h1>QUICK VIEW</h1>
        </div>
        <div className="product-card-text">
            <h3>Melted Sweatshirt</h3>
            <Link to="/shop/product/showcase?id=m-1">VIEW ITEM</Link>
        </div>
    </div>

    <div className="product-card col-4">
        <div className="product-status-chip" style={{ opacity: 1 }}>
            <h6>SOLD OUT</h6>
        </div>
        <div className="product-card-image">
            <Link to="/shop/product/showcase?id=m-2">
                <LazyLoadImage effect="blur" src="/shop/melt-pants.png" alt="img for card" loading='lazy'/>
            </Link>
        </div>
        <div className="quick-view">
            <h1>QUICK VIEW</h1>
        </div>
        <div className="product-card-text">
            <h3>Melted Sweatpants</h3>
            <Link to="/shop/product/showcase?id=m-2">VIEW ITEM</Link>
        </div>
    </div>

    <div className="product-card col-4">
    <div className="product-status-chip" style={{ opacity: 1 }}>
                  <h6>SOLD OUT</h6>
        </div>
        <div className="product-card-image">
            <Link to="/shop/product/showcase?id=m-4">
                <LazyLoadImage effect="blur" src="/shop/melt-socks.png" alt="img for card" loading='lazy' />
            </Link>
        </div>
        <div className="quick-view">
            <h1>QUICK VIEW</h1>
        </div>
        <div className="product-card-text">
            <h3>Melted Socks</h3>
            <Link to="/shop/product/showcase?id=m-4">VIEW ITEM</Link>
        </div>
    </div>
      </div>
      </div>

      <div className="kints" id='kints'>
        <div className="banner row">
        <div className="banner-text banner-knits col-6">
        <div className="banner-text-above-btn"><p>knits.</p></div>
          <Link to="/shop/product?category=knits">-See More-</Link>
        </div>
        <div className="banner-img col-6">
          <Link to="/shop/product?category=knits"><LazyLoadImage effect="blur" src="/shop/knits-banner.png" alt="knits-banner" loading='lazy'/></Link>
        </div>
      </div>

        <div className="product-grid">
            <div className="product-card col-4">
            <div className="product-status-chip" style={{ opacity: 1 }}>
                  <h6>SOLD OUT</h6>
                </div>
                <div className="product-card-image">
                    <Link to="/shop/product/showcase?id=k-3">
                        <LazyLoadImage effect="blur" src="/shop/k-beanie.png" alt="img for card" loading="lazy" />
                    </Link>
                </div>
                <div className="quick-view">
                    <h1>QUICK VIEW</h1>
                </div>
                <div className="product-card-text">
                    <h3>Mischief Beanie</h3>
                    <Link to="/shop/product/showcase?id=k-3">VIEW ITEM</Link>
                </div>
            </div>

            <div className="product-card col-4">
            <div className="product-status-chip" style={{ opacity: 0 }}>
                  <h6>SOLD OUT</h6>
                </div>
                <div className="product-card-image">
                    <Link to="/shop/product/showcase?id=k-1">
                        <LazyLoadImage effect="blur" src="/shop/knits-2.png" alt="img for card" loading="lazy" />
                    </Link>
                </div>
                <div className="quick-view">
                    <h1>QUICK VIEW</h1>
                </div>
                <div className="product-card-text">
                    <h3>Tsuki すき Knit Sweater</h3>
                    <Link to="/shop/product/showcase?id=k-1">VIEW ITEM</Link>
                </div>
            </div>

            <div className="product-card col-4">
                <div className="product-status-chip" style={{ opacity: 1 }}>
                    <h6>SOLD OUT</h6>
                </div>
                <div className="product-card-image">
                    <Link to="/shop/product/showcase?id=k-2">
                        <img src="shop/knits-3.png" alt="img for card" loading="lazy" />
                    </Link>
                </div>
                <div className="quick-view">
                    <h1>QUICK VIEW</h1>
                </div>
                <div className="product-card-text">
                    <h3>楽しい Tanoshii / 悲しみ Kanashimi Beanies</h3>
                    <Link to="/shop/product/showcase?id=k-2">VIEW ITEM</Link>
                </div>
            </div>
        </div>


      </div>


      </div>

    </>
  );
};

export default Collecton;
