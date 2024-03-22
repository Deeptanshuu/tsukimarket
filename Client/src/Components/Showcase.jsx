import React, { useState } from "react";
import { GlassMagnifier} from "react-image-magnifiers";
import QuantitySelector from "./QuatitySelector";
import { useCart } from "./CartContext";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";
import itemsData from "./items.json";
import "./Showcase.css";

const Showcase = () => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const allItems = Object.values(itemsData).flatMap((category) => category);
  const selectedItem = allItems.find((item) => item.id === id);


  const [mainImg, setMainImg] = useState(selectedItem.img);
  const handleImageClick = (imgSrc) => {
    setMainImg(imgSrc);
  };

  function handleAddToCart() {
    addToCart(selectedItem);
    toast("Item added to your cart! ✅", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      transition: Slide,
      closeOnClick: true,
      draggable: true,
      theme: "light",
    });
  }

  if (!selectedItem) {
    return <div>Item not found!</div>;
  }

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div>
      <div className="header-showcase">
        <h1>- Item details -</h1>
      </div>

      <div className="showcase-wrapper row" key={selectedItem.id}>
        <div className="showcase-img col-6 z-3">
          <div className="showcase-img-list-icons">
            {["img2", "img3", "img4"].map((imgKey) => (
              <div className="img-list" key={imgKey}>
                <button
                  className="img-list-button"
                  onClick={() => handleImageClick(selectedItem[imgKey])}
                >
                  <img src={selectedItem[imgKey]} alt={`showcase-img-${imgKey}`} />
                </button>
              </div>
            ))}
          </div>

          <div className="magnify-image-container">
            <div className="magnify-image">
            <GlassMagnifier
              imageSrc={mainImg}
              imageAlt="showcase-img"
              magnifierSize="60%"
              magnifierBorderColor="rgba(0, 0, 0)"
              magnifierBorderSize="1"
            />
            </div>
            <p>made with love, <br></br>from tsuki ❤️</p>
            
          </div>
        </div>

        <div className="showcase-text col-6">
          <div className="showcase-text-name">
            <h2>{selectedItem.name}</h2>
          </div>

          <div className="showcase-text-price">
            <h4>₹{selectedItem.price}/-</h4>
          </div>

          <div className="showcase-text-stock">
            <h6>{selectedItem.inStock ? "In Stock" : "Out of Stock"}</h6>
          </div>

          <div class="dropdown">
            <button
              class="btn btn-outline-dark dropdown-toggle z-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Select a Size
            </button>
            <ul class="dropdown-menu">
              <li>
                <button class="dropdown-item">Xtra Small -XS-</button>
              </li>
              <li>
                <button class="dropdown-item">Small -S-</button>
              </li>
              <li>
                <button class="dropdown-item">Medium -M-</button>
              </li>
              <li>
                <button class="dropdown-item">Large -L-</button>
              </li>
              <li>
                <button class="dropdown-item">Xtra Large -XL-</button>
              </li>
            </ul>
          </div>

          <div className="quantity-box-container">
            <QuantitySelector
              quantity={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          </div>

          <div className="add-cart">
            <button
              className={`btn btn-outline-dark ${
                selectedItem.inStock ? "" : "disabled"
              }`}
              onClick={() => handleAddToCart()}
            >
              Add to Cart
            </button>
          </div>

          <div className="showcase-text-desc">
            <p>{selectedItem.description}</p>
          </div>

          <div className="details">
            <u>DETAILS:</u>
            <p>•Embroidery details on front and back, 100% cotton.</p>
            <p>
              •<b>Care Instructions:</b> Hand wash with soap and water, air dry,
              do not put in washer/dryer.
            </p>
            <p>•80% acrylic, 20% nylon; made with extra fluffy yarn.</p>
            <p>
              •Wash at 30 degrees celsius, cool iron, dry flat, do not bleach or
              dry clean.
            </p>
            <p>
              •Made in the UK as a fully fashioned flat knit, producing a nearly
              waste free product.
            </p>
          </div>
        </div>

        <div className="footer-showcase">
          <Link to="/shop" className="back-to-collection-button">
            <p>- Back to Collection -</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
