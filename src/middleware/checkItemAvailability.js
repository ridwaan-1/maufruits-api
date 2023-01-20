const { sqlQueryExecutor } = require("../services/queyExecutor.js");

const checkItemAvailability = async (req, res, next) => {
    const { cart } = req.body;
    const errArr = [];
    let totalPrice = 0;
    for (const item of cart){
        const response = await sqlQueryExecutor(`SELECT numInStock, sellingPrice from product WHERE id=${item.id}`);
        if (response[0].numInStock < item.qty) {
            const errMsg = response[0].numInStock===0 ? 'Sorry we do not have this item in stock' :
                                                    `Only ${response[0].numInStock} available right now`;
            errArr.push({
                id: item.id,
                qty: response[0].numInStock,
                errMsg  
            });
        } else {
            totalPrice += parseInt(response[0].sellingPrice) * parseInt(item.qty);
        }
    };
    
    if (errArr.length>0) return res.status(200).json({error: errArr});
    req.totalPrice = totalPrice;
    next();
}

module.exports = checkItemAvailability;