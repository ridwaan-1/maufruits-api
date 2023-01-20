const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sqlQueryExecutor } = require("../services/queyExecutor.js");

const authFunction = async (type, email, password) => {
    const sqlQuery = `SELECT * FROM ${type} where email='${email}'`;
    const response = await sqlQueryExecutor(sqlQuery);

    if (response.length===0) return { 
        statusCode: 404,
        content: {
            message: "This email is not connected to any account."
        }
    };
    
    const pwdValid = await bcrypt.compare(password, response[0].password); 
    if (!pwdValid) return {
        statusCode: 404,
        content: {
            message: "The password you’ve entered is incorrect"
        }
    }; 

    const token = jwt.sign({ id: response[0].id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 36000
    });

    return { 
        statusCode: 200,
        content: {
            name: response[0].fname, 
            email, 
            accessToken: token 
        }
    };
}

module.exports = authFunction;