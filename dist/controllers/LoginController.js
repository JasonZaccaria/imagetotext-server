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
const Login_1 = __importDefault(require("../models/Login"));
const cookieParser = require("cookie-parser");
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (Object.keys(req.cookies)[0] === "halt") {
        res.json({ halt: "not allowed" });
    }
    else {
        let callLogin = new Login_1.default(req.body.user, req.body.pass);
        let getLoginResponse = yield callLogin.loginUser();
        let accessToken = getLoginResponse.token;
        let refreshToken = getLoginResponse.rtoken;
        if (accessToken) {
            res.cookie("token", accessToken, { sameSite: "none", secure: true });
            res.cookie("rtoken", refreshToken, { sameSite: "none", secure: true });
            res.json({ accessToken: accessToken });
        }
        else {
            res.json({ failure: "could not login user/db error/network error" });
        }
    }
});
exports.default = loginController;
