import React, { Fragment, useEffect, useState } from 'react';
import "./Products.css" ;
import { useSelector, useDispatch } from 'react-redux';
import {clearErrors, getProduct} from "../../actions/productAction";
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCrad';
import {useParams} from "react-router-dom";
import Pagination from "react-js-pagination";
import {Slider} from '@mui/material';
import { Typography } from '@mui/material';
import{useAlert} from "react-alert";
import MetaData from '../layout/MetaData';



const categories =[
  "Mens",
  "Womens",
  "Child",
  "Others",
];



const Products = () => {
    const dispatch = useDispatch();

    const alert = useAlert();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0,25000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);
    const {
      products, 
      loading, 
      error, 
      productsCount, 
      resultPerPage,
    } = useSelector(
        (state) => state.products
    );
      //const param = useParams();
    const {keyword} = useParams();

    const setCurrentPageNo =(e)=>{
      setCurrentPage(e)
    }

    const priceHandler = (event, newPrice) =>{
      setPrice(newPrice);
    }

useEffect(() => {

  if(error){
    alert.error(error);
    dispatch(clearErrors());
  }
  //console.log(keyword);

  dispatch(getProduct(keyword, currentPage, price, category, ratings));
  
}, [currentPage, dispatch, keyword, price, category, ratings, error, alert]);




  return (
    <Fragment>
      {
        loading ? <Loader/> :

        <Fragment>

          <MetaData title = "PRODUCTS -- IndieCraft"/>

          <h2 className='productsHeading'> Products</h2>
          <div className= "products"> 
        {
          products && 
          products.map((product) => (
            <ProductCard key ={product._id} product = {product}/>
          ))
        }
        </div>

        <div className='filterBox'>
        <Typography>Price</Typography>
        <Slider 
          value={price}
          onChange={priceHandler}
          valueLabelDisplay="auto"
          aria-labelledby='range-slider'
          min = {0}
          max = {25000}
        />

        <Typography> Categories</Typography>
        <ul className='categoryBox'>
          {categories.map((category) =>(
            <li
              className='category-link'
              key={category}
              onClick={() => setCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>

        <fieldset>
          <Typography component="legend">Ratings Above</Typography>
          <Slider
            value={ratings}
            onChange={(e,newRating) => {
              setRatings(newRating);
            }}
            aria-labelledby="continuous-slider"
            min={0}
            max={5}
            valueLabelDisplay="auto"
          />
        </fieldset>
      </div>

      { resultPerPage < productsCount && (
        <div className='paginationBox'>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={resultPerPage}
          totalItemsCount={productsCount}
          onChange = {setCurrentPageNo}
          nextPageText="Next"
          prevPageText="Prev"
          firstPageText="1st"
          lastPageText="Last"
          itemClass='page-item'
          linkClass='page-link'
          activeClass='pageItemActive'
          activeLinkClass='pageLinkActive'
        />
      </div>
      )}
    </Fragment>
      }
    </Fragment>
  )
};

export default Products;