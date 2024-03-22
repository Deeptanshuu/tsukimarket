import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = window.scrollY;
      const shouldBeSticky = scrollHeight > 300; // Adjust the threshold as needed

      setIsSticky(shouldBeSticky);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav className="Navbar">
        <div className="logo-container">
        <Link to="/"><img src="/TSUKI_LOGO.png" class="logo" alt="logo img" /></Link>
          <div className="mantra">
            <Link to="/">-Tsuki – Illuminate Your Style, Consciously.-</Link>
          </div>
          <div className="nav-icons">
            <Link to="/search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
            </Link>
            <Link to="/register">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-person-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
            </Link>
            <Link to="/cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-cart"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
            </svg>
            </Link>
          </div>
        </div>
        <div className={`Navbar-links-wrapper ${isSticky ? "sticky" : ""}`}>
            <ul className="nav-links">
              <Link to="/login">
                <li> Loginコレクション </li>
              </Link>
              <Link to="/">
                <li> Homeホームページ </li>
              </Link>
              <Link to="/shop">
                <li> Collectionすべての商品 </li>
              </Link>
              <Link to="/contact">
                <li> Contact usお問い合わせ </li>
              </Link>
            </ul>
        </div>
      </nav>

    </>
  );
};

export default NavBar;
