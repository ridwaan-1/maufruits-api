const { verify } = require("jsonwebtoken");

/**
 * It checks if the token is provided in the request header, if not, it returns a 403 status code with
 * a message. If the token is provided, it verifies the token with the secret key and if the token is
 * invalid, it returns a 401 status code with a message. If the token is valid, it sets the userId to
 * the decoded id and calls the next function.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 * @returns The token is being returned.
 */

const verifyToken = (req, res, next) => {
    const authToken = req.headers['authorization'];
    const token = authToken.substring(7);
    if (!token) return res.status(403).json({ message: 'No tokens provided' });

    verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unathorized' });
        req.userId = decoded.id;
        next();
    })
}

module.exports = verifyToken;