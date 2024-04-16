import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import itemsData from './items.json';
import './Product.css';
import { ToastContainer } from "react-toastify";

const Products = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category'); // Default to 'all' if no category specified

  const [items, setItems] = useState([]);

  useEffect(() => {
    const filteredItems = itemsData[category] || [];
    setItems(filteredItems);
  }, [category]);

  return (
    <div>
      <ToastContainer/>
      <div className={`header-prod header-prod-${category}`}><h2>-{category}-</h2></div>
      <div className="product-grid">

      {items.map(item => (
        
            <div className="product-card" id={item.id}>
              <Link to={`/shop/product/showcase?id=${item.id}`} className="view-item-button">

                <div className="product-status-chip" style={{ opacity: item.inStock ? 0 : 1 }}>
                      <h6>SOLD OUT</h6>
                </div>


              <div className="product-card-image">
                {<Link to={`/shop/product/showcase?id=${item.id}`}>
                <LazyLoadImage effect="blur" src={item.img} alt="product-card-view" loading='lazy' />
                </Link> }
                </div>

                <div className="quick-view">
                  <h1>QUICK VIEW</h1>
              </div>
              <div className="product-card-text">         
                <h3>{ item.name }</h3>
                    <Link to={`/shop/product/showcase?id=${item.id}`} className="view-item-button">
                    - View Item -
                    </Link>
              </div>


              </Link>
            </div>
      ))}
      
      </div>

          <div className="footer p-5 text-xl-center fw-lighter " style={{background: "#f4e0ea"}}>
            <Link to='/shop'><p style={{color: "black"}}>- BACK TO COLLECTION -</p></Link>
           <small style={{color: "black"}}>-😊 HAPPY SHOPPING ハッピー・ショッピング 😊-</small>
          </div>
    </div>
  );
};

export default Products;
