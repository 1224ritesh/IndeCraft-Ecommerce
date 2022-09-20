import './App.css';
import Header from "./component/layout/Header/Header.js";
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.jsx";
import Products from "./component/Product/Products.jsx";
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp';

function App() {

  React.useEffect(()=>{
    WebFont.load({
      google:{
        families: ["Roboto", "Droid Ssans", "Chilanka"],
      },
    });
  
  },[]);

  return (
    <Router>  
      <Header/>
        <Routes>
          <Route  path='/' element={<Home/>}/>
          <Route  path='/product/:id' element={<ProductDetails/>}/>
          <Route  path='/products' element={<Products/>}/>
          <Route  path='/products/:keyword' element={<Products/>}/> {/* route for searching products*/}
          <Route  path='/search' element={<Search/>}/>
          <Route  path='/login' element={<LoginSignUp/>}/>
        </Routes>
      <Footer/>
    </Router>
    
  );
}

export default App;
