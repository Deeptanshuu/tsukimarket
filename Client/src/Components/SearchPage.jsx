import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
//import { useNavigate } from "react-router-dom";
import itemsData from "./items.json"; // Adjust the path as needed
import './SearchPage.css'

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTermFromUrl = searchParams.get("name") || "";

  const [searchTerm, setSearchTerm] = useState(searchTermFromUrl);
  //const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Update the URL with the new search term
    //navigate(`/search?name=${encodeURIComponent(searchTerm)}`);
    //window.location.reload();
  };

  // Combine items from all categories
  const allItems = [
    ...itemsData.melts,
    ...itemsData.knits,
    ...itemsData.basics,
  ];


  const filteredItems = allItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to render ClothingDisplayComponent
  const renderClothingDisplay = () => {
    if (filteredItems.length === 0 && searchTerm !== "") {
      return (
        <div className="dotted-bg">
          <div className="product-grid-header no-item-page">
            <p>No matching items found.😔</p>
          </div>
        </div>
      );
    }
    if (searchTerm === "") {
      return (
        <div className="dotted-bg">
          <div className="product-grid-header defualt-search-page">
            <p>Search for products on our site.🔍</p>
          </div>
        </div>
      );
    }
    return (
      <>
        <div className="product-grid-header"><p>Your search revealed the following:</p></div>
        <div className="product-grid">
          {filteredItems.map((item) => (
            <div className="product-card" key={item.id}>

              <div className="product-status-chip" style={{ opacity: item.inStock ? 0 : 1 }}>
                      <h6>SOLD OUT</h6>
                </div>
              <div className="product-card-image">
                <Link to={`/showcase?id=${item.id}`}>
                  <LazyLoadImage effect="blur" src={item.img} alt={item.name}/>
                </Link>

              </div>

              <div className="product-card-text">
                <div className="quick-view">
                      <h1>QUICK VIEW</h1>
                </div>
                <h3>{item.name}</h3>
                <Link to={`/showcase?id=${item.id}`} className="view-item-button">
                  -See More-
                </Link>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
    <div className="search-container">
      <h1>-Search-</h1>

      <div className="search-box-outer">
        <div className="search-box">
        <form onSubmit={handleSearch}>
            <input
              className="form-control"
              type="text"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button class="btn btn-outline-dark">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </form>
          </div>
        </div>

    </div>

    {renderClothingDisplay()}
    </>
  );
};

export default SearchPage;
