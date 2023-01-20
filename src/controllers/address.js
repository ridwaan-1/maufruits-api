const { sqlQueryExecutor } = require("../services/queyExecutor.js");


exports.getUserAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const sqlQuery = `SELECT i.id as addrId, u.fname, u.othername, i.addressLine, i.city, i.contactNumber 
                        FROM usercontact_info i, user_info u 
                        WHERE i.user_id=u.id 
                        AND user_id=${userId};`
        const data = await sqlQueryExecutor(sqlQuery);

        res.status(200).json(data);
    } catch(err) {
        res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }   
};

exports.postUserAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { address } = req.body;
        
        const sqlQuery = `INSERT INTO usercontact_info (addressLine, city, contactNumber, user_id) 
                        VALUES ('${address.addressLine}', '${address.city}', '${address.contactNumber}', ${userId})`;
        const data = await sqlQueryExecutor(sqlQuery);
        res.status(200).json(data);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}
