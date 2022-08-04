"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.router = router;
const cors = require("cors");
const bcrypt = require("bcrypt");
//const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs"); //used to manipulate folders and files
const path = require("path");
//below is our pool configuration
const pool_1 = require("../services/pool");
//import for authenticate toke two
const authenticateToken_1 = require("../services/authenticateToken");
//now we will import below our controllers
const RegisterController_1 = __importDefault(require("../controllers/RegisterController"));
const LoginController_1 = __importDefault(require("../controllers/LoginController"));
router.get("/auth", authenticateToken_1.authenticateTokenTwo, (req, res) => {
    res.json({ success: "user authenticated" });
});
router.post("/register", RegisterController_1.default);
router.post("/login", LoginController_1.default);
router.get("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("token has been cleared");
    res.clearCookie("token", {
        sameSite: "none",
        secure: true,
    });
    res.end();
}));
router.post("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //this route is used to send us a new accesstoken by using our refresh token and authenticating with that and then sending a new access token
    const refreshToken = req.cookies.rtoken;
    if (refreshToken === null) {
        return res.json({ failure: "no refresh token sent back to server" });
    }
    try {
        const compareRefreshQuery = yield pool_1.pool.query("SELECT refresh FROM usertable");
        if (compareRefreshQuery.rows[0] === refreshToken) {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.json({ failure: "refresh token failed verification" });
                }
                const userObject = { user: req.body.user };
                const accessToken = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: "900s",
                });
                res.cookie("token", accessToken, { sameSite: "none", secure: true });
            });
        }
    }
    catch (err) {
        console.log("error couldn't find refresh on cookie or couldn't get refresh from database as it does not exist yet");
        res.json({ failure: "could not authenticate refresh token" });
    }
}));
router.get("/halt", (req, res) => {
    let date = new Date();
    date.setTime(date.getTime() + 5 * 60 * 1000);
    res.cookie("halt", "asdfasdf", {
        sameSite: "none",
        secure: true,
        /*maxAge: 300,*/
        expires: date,
    });
    res.json({ success: "halt cookie has been created successfully" });
    res.end();
});
