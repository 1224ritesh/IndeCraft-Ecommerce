import React, { Fragment, useState} from 'react';
import "./Search.css"
import {useNavigate} from 'react-router-dom'; //in react router dom v6 
import MetaData from '../layout/MetaData';

const Search = () => {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate()
    const searchSubmitHandler = (e) =>{
        e.preventDefault();
        if(keyword.trim()){
            navigate(`/products/${keyword}`)// //in react router dom v6 use useNavigate instead of history.push
        }else{
            navigate("/products")
        }

    };


  return (
    <Fragment>
        <MetaData title = "Search a Product -- IndieCraft"/>
       <form className =" searchBox" onSubmit = {searchSubmitHandler}>
            <input 
                type="text" 
                placeholder='Search A Product'
                onChange={(e) => setKeyword(e.target.value)}
            />

            
            <input 
                type = "submit" value="Search"
            />
       </form>
    </Fragment>
  )
}

export default Search