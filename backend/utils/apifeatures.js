const { remove } = require("../models/productModel");

class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    //api search for keyword
    search(){
        const keyword = this.queryStr.keyword ? {
            //pattern matching for searching using mongodb_regular_expression
            name:{
                $regex:this.queryStr.keyword,
                $options:'i',// for the case insensitive
            },
        }:{};
        //console.log(keyword);

        this.query = this.query.find({...keyword});
        return this;
    }

    //filter for category filteration
    filter(){
        const queryCopy = {...this.queryStr}
        

        // Removing some fields for category
        const removeFields = ["keyword","page","limit"];

        removeFields.forEach(key => delete queryCopy[key]);

        // filter for Price and Rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    //for pagination 
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage*(currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
};

module.exports = ApiFeatures