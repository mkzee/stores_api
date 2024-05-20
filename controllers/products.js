require('express-async-errors')
const Product = require('../model/products')

const getAllProductsStatic = async (req, res) => {
    const product = await Product.find({}).select('name company rating').limit(10).skip(2)
    res.status(200).json({product, nbHits: product.length});
}

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query;
    const queryObject = {}

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false;
    }

    if (company) {
        queryObject.company = company
    }

    if (name) {
        queryObject.name = {$regex: name, $options: 'i'};
    }

    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<=': '$lte',
            '<': '$lt',
        }

        const regEx = /\b(>|>=|=|<=|<)\b/g
        filters = numericFilters.replace(
            regEx, 
            (match) => `-${operatorMap[match]}-`
        )

        const options = ['price', 'ratings']
        filters = filters.split(',').forEach(item => {
            const [field, operator, value] = item.split('-');

            
            if (options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}
                console.log(queryObject)
            }

        });
    }

    let result = Product.find(queryObject);

    if (sort) {
        let sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    } else {
        result.sort('createdAt');
    }

    if (fields) {
        let fieldList = fields.split(',').join(' ');
        result = result.select(fieldList)
    }

    //pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.body.limit) || 10
    const skip = (page - 1) * limit
    result.limit(limit).skip(skip)

    
    const product = await result;
    res.status(200).json({product, nbHits: product.length});
}


module.exports = {
    getAllProductsStatic, 
    getAllProducts
}