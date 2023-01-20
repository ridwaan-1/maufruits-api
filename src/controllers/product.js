const { queryCreatorProduct } = require("../helpers/queryHelpers.js");
const { sqlQueryExecutor } = require("../services/queyExecutor.js");

exports.getHomepageProduct = async (req, res) => { 
    try {
        const { limit=10 } = req.query;   
        const popular = await sqlQueryExecutor(`SELECT * FROM total_sales WHERE numInStock > 0 ORDER BY sales DESC LIMIT ${limit}`);

        const newProduct = await sqlQueryExecutor(`SELECT * FROM productsinfo WHERE numInStock > 0 AND grade='A' ORDER BY dateObtain DESC LIMIT ${limit}`);
 
        res.status(200).json({
            success: true,
            data: {
                newProduct,
                popular
            }
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong'
        });
    }
}

exports.getAllProduct = async (req, res) => {
    try {
        const sqlQuery = queryCreatorProduct({
            tableName: 'productsinfo',
            id: 'product_id',
            ...req.query,
            additionalQuery: 'numInStock > 0'
        });

        const productsInfo = await sqlQueryExecutor(sqlQuery.infoQuery);
        const totalProducts = await sqlQueryExecutor(sqlQuery.counterQuery);

        res.status(200).json({
            num: totalProducts[0].num,  
            data: productsInfo  
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}

exports.getPopularProduct = async (req, res) => {
    try {
        const sqlQuery = queryCreatorProduct({
            tableName: 'total_sales',
            id: 'product_id',
            ...req.query,
            sort: ['sales DESC'],
            additionalQuery: 'numInStock > 0'
        });

        const productsInfo = await sqlQueryExecutor(sqlQuery.infoQuery);
        const totalProducts = await sqlQueryExecutor(sqlQuery.counterQuery);

        res.status(200).json({
            num: totalProducts[0].num,  
            data: productsInfo,
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}

exports.getRecentProduct = async (req, res) => {
    try {
        const sqlQuery = queryCreatorProduct({
            tableName: 'productsinfo',
            id: 'product_id',
            ...req.query,
            sort: ['dateObtain DESC'],
            additionalQuery: 'numInStock > 0'
        });

        const productsInfo = await sqlQueryExecutor(sqlQuery.infoQuery);
        const totalProducts = await sqlQueryExecutor(sqlQuery.counterQuery);

        res.status(200).json({
            num: totalProducts[0].num,  
            data: productsInfo, 
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}