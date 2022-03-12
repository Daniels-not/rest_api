const jwt = require("jsonwebtoken");
const config = require("config");


// validate token jwt


let verifyToken = (req, res, next) => {
    let token = req.get("Authorization");

    jwt.verify(token, config.get("JWT_KEY"), (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Unauthorized access"
            });
        }

        req.user = decoded.user;
        next();
    });
};


module.exports = verifyToken;