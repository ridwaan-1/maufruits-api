const { queryCreatorOrder } = require("../../helpers/queryHelpers");
const { sqlQueryExecutor } = require("../../services/queyExecutor");

exports.getAllOrders = async (req, res) => {
    try {
        const sqlQuery = queryCreatorOrder({
            tableName: 'orders',
            colId: 'order_id',
            ...req.query
        });

        const productsInfo = await sqlQueryExecutor(sqlQuery.infoQuery);
        const totalProducts = await sqlQueryExecutor(sqlQuery.counterQuery);

        res.status(200).json({
            num: totalProducts[0].num,  
            data: productsInfo  
        });
    } catch(err) {
        res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}