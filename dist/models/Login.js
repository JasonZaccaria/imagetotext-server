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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Login_email, _Login_password;
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = require("../services/pool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class Login {
    constructor(email, password) {
        _Login_email.set(this, void 0);
        _Login_password.set(this, void 0);
        __classPrivateFieldSet(this, _Login_email, email, "f");
        __classPrivateFieldSet(this, _Login_password, password, "f");
    }
    get getEmail() {
        return __classPrivateFieldGet(this, _Login_email, "f");
    }
    set setEmail(newEmail) {
        __classPrivateFieldSet(this, _Login_email, newEmail, "f");
    }
    get getPassword() {
        return __classPrivateFieldGet(this, _Login_password, "f");
    }
    set setPassword(newPassword) {
        __classPrivateFieldSet(this, _Login_password, newPassword, "f");
    }
    loginUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userQuery = yield pool_1.pool.query("SELECT * FROM usertable WHERE email = $1", [__classPrivateFieldGet(this, _Login_email, "f")]);
                console.log("connected to db successfully");
                if (userQuery.rows.length === 0) {
                    console.log("account not found");
                    return { failure: "account not found " };
                }
                else if (userQuery.rows.length === 1) {
                    const userEmail = userQuery.rows[0]["email"];
                    const userPass = userQuery.rows[0]["password"];
                    if (yield bcrypt.compare(__classPrivateFieldGet(this, _Login_password, "f"), userPass)) {
                        console.log("SUCCESS USER IS NOW LOGGED IN");
                        const userObject = { user: __classPrivateFieldGet(this, _Login_email, "f") };
                        const accessToken = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "900s" });
                        const refreshToken = jwt.sign(userObject, process.env.REFRESH_TOKEN_SECRET);
                        const refreshQuery = yield pool_1.pool.query("UPDATE usertable SET refresh = $1 WHERE email = $2", [refreshToken, __classPrivateFieldGet(this, _Login_email, "f")]);
                        return { token: accessToken, rtoken: refreshToken };
                    }
                    else {
                        console.log("NOT ALLOWED USER DID NOT GET IN");
                        return { STOP: "NOT ALLOWED" };
                    }
                }
            }
            catch (err) {
                return { failure: "could not login user/db error/network error" };
            }
            return { function: "finished" };
        });
    }
}
_Login_email = new WeakMap(), _Login_password = new WeakMap();
exports.default = Login;
