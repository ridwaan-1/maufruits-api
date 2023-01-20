const { queryCreatorProduct } = require("../../helpers/queryHelpers");
const { sqlQueryExecutor, sqlTransactionExecutor } = require("../../services/queyExecutor");

exports.getAllProduct = async (req, res) => {
    try {
        const sqlQuery = queryCreatorProduct({
            tableName: 'productsinfo',
            id: 'product_id',
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

exports.addNewProduct = async (req, res) => {
    try {
        const { name, imgPath, quantity, costPrice, description, supplier } = req.body.inventoryDetails;
        const { measureUnit, stocks } = req.body.storeDetails;

        sqlTransactionExecutor(async conn => {
            const [pInfo, ] = await conn.query(`INSERT INTO product_info(name, description, unitMeasure, imgPath)
                                                VALUES ('${name}', '${description}', '${measureUnit}', '${imgPath}')`);

            const [invInfo, ] = await conn.query(`INSERT INTO inventory(quantity, buyingPrice, supplier_id, prodInfo_id)
                                                VALUES (${quantity}, ${costPrice}, ${supplier}, ${pInfo.insertId})`);
            
            for(const stock of stocks) {
                await conn.query(`INSERT INTO product(inventory_id, numInStock, sellingPrice, grade)
                                VALUES (${invInfo.insertId}, ${stock.stock}, ${stock.price}, '${stock.grade}')`);
            }
        });

        return res.status(200).json({ status: true });
    } catch(err) {
        res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}

exports.getInvDetails = async (req, res) => {
    try {
        const invId = req.params.id;
        const response = await sqlQueryExecutor(`SELECT grade, numInStock, sellingPrice FROM productsinfo WHERE inventory_id='${invId}'`);

        return res.status(200).json({ 
            status: true,
            data: response
        });
    } catch(err) {
        res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}

exports.updateProductRecord = async (req, res) => {
    try {
        const invId = req.params.id;
        
        sqlTransactionExecutor(async conn => {
            for(const g in req.body) {
                const query = `UPDATE productsinfo SET numInStock=${req.body[g].stock},sellingPrice=${req.body[g].price} WHERE inventory_id=${invId} AND grade='${g}';`;
                const [response, ] = await conn.query(query);

                if(req.body[g].price>0) {
                    if(response.affectedRows===0) {
                        await conn.query(`INSERT INTO product(inventory_id, numInStock, sellingPrice, grade) 
                                        VALUES (${invId}, ${req.body[g].stock}, ${req.body[g].price}, '${g}')`);
                    }
                }
            }
        });

        return res.status(200).json({ 
            status: true
        });
    } catch(err) {
        res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}