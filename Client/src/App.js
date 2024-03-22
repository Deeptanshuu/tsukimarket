import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { CartProvider } from './Components/CartContext';
import { SpeedInsights } from "@vercel/speed-insights/react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import Footer from './Components/Foooter';
import Header from './Components/Header';
import Register from './Components/Register';
import Collecton from './Components/Collecton';
import Contact from './Components/Contact';
import Product from './Components/Product';
import Showcase from './Components/Showcase';
import SearchPage from './Components/SearchPage';
import CartPage from './Components/CartPage';
import LoadingScreen from './Components/LoadingScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const images = document.querySelectorAll('img');
    const imageCount = images.length;

    console.log(images);

    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === imageCount) {
        // Simulate a delay of 500 milliseconds
        //setTimeout(() => {
          setLoading(false);
        //}, 6001);
      }
    };

    images.forEach((image) => {
      if (image.complete) {
        handleImageLoad();
      } else {
        image.addEventListener('load', handleImageLoad);
      }
    });

    // Cleanup event listeners
    return () => {
      images.forEach((image) => {
        image.removeEventListener('load', handleImageLoad);
      });
    };
  }, []);

  return (
    <CartProvider>
      <SpeedInsights/>
      <Router>
      <Header/>
      <NavBar/>
      {loading ?
        (<LoadingScreen/>) 
        : (
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/shop' element={<Collecton/>}></Route>
          <Route path='/contact' element={<Contact/>}></Route>
          <Route path='/shop/product' element={<Product/>}></Route>
          <Route path='/showcase' element={<Showcase/>}></Route>
          <Route path='/cart' element={<CartPage/>}></Route>
          <Route path='/search' element={<SearchPage/>}></Route>
        </Routes>
        )}
      </Router>
      <Footer/>
      <ToastContainer
      limit={10}
      />
    </CartProvider>
  );
}

export default App;
