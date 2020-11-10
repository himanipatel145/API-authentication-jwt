const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    const token = req.header('tokens')
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}

