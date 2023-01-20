const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authFunction = require("../services/authFunction.js");
const { sqlQueryExecutor } = require("../services/queyExecutor.js");

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const authResponse = await authFunction("user_info", email, password);

        return res.status(authResponse.statusCode).json(
            authResponse.content
        );

    } catch(err) {
        return res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}

exports.signUp = async (req, res) => {
    try {
        const { email, password, cPassword, fname, othername } = req.body;

        let sqlQuery = `SELECT * FROM user_info where email='${email}'`;
        let response = await sqlQueryExecutor(sqlQuery);
        if (response.length>0) return res.status(404).json({ message: 'Already have an account associated with this email.' });

        if (password!==cPassword) return res.status(500).json({ message: 'Passwords do not match' });

        const hash = await bcrypt.hash(password, 10);

        sqlQuery = `INSERT INTO user_info (fname, othername, email, password, createdAt) 
                    VALUES ('${fname}', '${othername}', '${email}', '${hash}', NOW());`;
        response = await sqlQueryExecutor(sqlQuery);
        const token = jwt.sign({ id: response.insertId }, process.env.JWT_SECRET_KEY, {
            expiresIn: 36000
        })

        return res.status(200).json({ name: fname, email, accessToken: token });
    } catch(err) {
        return res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}
