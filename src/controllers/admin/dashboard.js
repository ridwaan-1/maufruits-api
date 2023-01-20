const { sqlQueryExecutor } = require("../../services/queyExecutor")

exports.getDashboardDetails = async (req, res) => {
    try {
        const lowStock = await sqlQueryExecutor("SELECT name, imgPath, numInStock as qty, sellingPrice, grade FROM productsinfo WHERE numInStock < 10 ORDER BY qty ASC");
        const topSales = await sqlQueryExecutor("SELECT name, imgPath, sales as qty, sellingPrice, grade FROM total_sales ORDER BY qty DESC LIMIT 10");
        const stats = await sqlQueryExecutor(`SELECT SUM(totalPrice) AS totalSales, SUM(quantity) as totalItemsSold, COUNT(order_id) as totalOrders FROM orders;
                                            SELECT COUNT(id) as completedOrders FROM order_details WHERE orderStatus='delivered';
                                            SELECT COUNT(id) as totalUsers FROM user_info;
                                            SELECT SUM(totalPrice) AS weeklySales, DATE_FORMAT(orderDate, '%d-%m-%Y') as salesDate FROM order_details GROUP BY orderDate ORDER BY orderDate DESC LIMIT 7;`)
        
        res.status(200).json({
            stats: {
                ...stats[0][0],
                ...stats[1][0],
                ...stats[2][0]
            },
            chart: {
                chartStats: stats[3].map(i => +i.weeklySales),
                chartLabels: stats[3].map(i => i.salesDate)
            },
            lowStock,
            topSales
        });
    } catch(err) {
        res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }   
}