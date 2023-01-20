const authFunction = require("../../services/authFunction.js");

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const authResponse = await authFunction("admininfo", email, password);

        return res.status(authResponse.statusCode).json(
            authResponse.content
        );
    } catch(err) {
        res.status(500).json({
            message: err.message ?? 'Something went wrong'
        });
    }
}