"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateTokenTwo = void 0;
const jwt = require("jsonwebtoken");
//second possible jwt cookie authentication method below... Above is the one by web dev simplified
function authenticateTokenTwo(req, res, next) {
    const token = req.cookies.token;
    console.log(token);
    try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        console.log(req.user);
        next();
    }
    catch (err) {
        res.clearCookie("token");
        return res.json({ failure: "invalid token and jwt token cookie cleared" });
    }
}
exports.authenticateTokenTwo = authenticateTokenTwo;
