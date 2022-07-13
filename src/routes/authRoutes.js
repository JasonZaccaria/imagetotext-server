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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.router = void 0;
var express_1 = require("express");
var router = (0, express_1.Router)();
exports.router = router;
var cors = require("cors");
var bcrypt = require("bcrypt");
var Pool = require("pg").Pool;
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
var fs = require("fs"); //used to manipulate folders and files
var path = require("path");
//below is our pool configuration
var pool = new Pool({
    user: "postgres",
    password: "ILTPvGaWA@1",
    host: "localhost",
    port: 5432,
    database: "imagetotext",
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    allowExitOnIdle: true
});
pool.on("error", function (err, client) {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});
//function for entering username and password into db
function db(userEmail, userPassword) {
    return __awaiter(this, void 0, void 0, function () {
        var results, resultTwo, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    //const client = await pool.connect();
                    console.log("conneccted successfully");
                    return [4 /*yield*/, pool.query("INSERT INTO usertable(email, password) VALUES($1, $2)", [userEmail, userPassword])];
                case 1:
                    results = _a.sent();
                    return [4 /*yield*/, pool.query("SELECT * FROM usertable")];
                case 2:
                    resultTwo = _a.sent();
                    console.table(resultTwo.rows);
                    //await client.query("COMMIT");
                    //await pool.end(); CHANGE
                    /*adding client.end()*/
                    //client.end();
                    //results.release();
                    console.log("client disconnected");
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.log("failed to execute ".concat(e_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//second possible jwt cookie authentication method below... Above is the one by web dev simplified
function authenticateTokenTwo(req, res, next) {
    var token = req.cookies.token;
    console.log(token);
    try {
        var user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        console.log(req.user); //here we can view the actual user email which is interesting
        next();
    }
    catch (err) {
        res.clearCookie("token");
        return res.json({ failure: "invalid token and jwt token cookie cleared" });
    }
}
function checkUsersTwo(user) {
    return __awaiter(this, void 0, void 0, function () {
        var userDuplicate, results, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userDuplicate = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    //const client = await pool.connect();
                    console.log("connected successfully");
                    return [4 /*yield*/, pool.query("SELECT email FROM usertable WHERE email = $1", [user])];
                case 2:
                    results = _a.sent();
                    //results.release();
                    //await pool.end(); CHANGE
                    //client.end();
                    //more changes start
                    //testing what happens when unknown user is here
                    console.log(results.rows);
                    if (results.rows.length === 0) {
                        console.log("no users with same name could be found");
                        userDuplicate = false;
                        return [2 /*return*/, userDuplicate];
                    }
                    else if (results.rows.length === 1) {
                        console.log("user with same email already in system");
                        userDuplicate = true;
                        return [2 /*return*/, userDuplicate];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log("error could not query database | or could mean that no other user exitst so far so userDuplicate will equal false");
                    console.log(err_1);
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
router.get("/auth", authenticateTokenTwo, function (req, res) {
    res.json({ success: "user authenticated" });
});
router.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword, userEvaluate, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, bcrypt.hash(req.body.pass, 10)];
            case 1:
                hashedPassword = _b.sent();
                return [4 /*yield*/, checkUsersTwo(req.body.user)];
            case 2:
                userEvaluate = _b.sent();
                if (userEvaluate) {
                    console.log(userEvaluate);
                    res.json({ failure: "user account already exists" });
                }
                else if (userEvaluate === undefined) {
                    console.log(userEvaluate);
                    res.json({ failure: "connection error please try again" });
                }
                else {
                    //changes here
                    console.log(userEvaluate);
                    db(req.body.user, hashedPassword);
                    //changes end
                    console.log("new user account created");
                    //changes on 6/20 here
                    fs.mkdir("./uploads/".concat(req.body.user), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("directory created successfully!");
                    });
                    //changes on 6/20 end here
                    res.json({ success: 200 });
                }
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                res.json({ failure: 500 });
                console.log("failed to register profile");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userQuery, userEmail, userPass, userObject, accessToken, refreshToken, refreshQuery, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                //here we compare username from sent to use and see if its in our db
                //const client = await pool.connect();
                console.log("connected to db successfully");
                return [4 /*yield*/, pool.query("SELECT * FROM usertable WHERE email = $1", [req.body.user])];
            case 1:
                userQuery = _b.sent();
                if (!(userQuery.rows.length === 0)) return [3 /*break*/, 2];
                res.json({ failure: "account not found" });
                console.log("account not found");
                return [3 /*break*/, 7];
            case 2:
                if (!(userQuery.rows.length === 1)) return [3 /*break*/, 7];
                userEmail = userQuery.rows[0]["email"];
                userPass = userQuery.rows[0]["password"];
                return [4 /*yield*/, bcrypt.compare(req.body.pass, userPass)];
            case 3:
                if (!_b.sent()) return [3 /*break*/, 5];
                //res.json({ success: "user is now logged in" }); CHANGE FOR NOW JWT NEEDS to res.json our auth token
                console.log("SUCCESS USER IS NOW LOGGED IN");
                userObject = { user: req.body.user };
                accessToken = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "900s" });
                refreshToken = jwt.sign(userObject, process.env.REFRESH_TOKEN_SECRET);
                return [4 /*yield*/, pool.query("UPDATE usertable SET refresh = $1 WHERE email = $2", [refreshToken, req.body.user])];
            case 4:
                refreshQuery = _b.sent();
                //client.release(); //just modified 7/12
                //client.end();
                //changes for cookie parser start
                //refreshQuery.release();
                res.cookie("token", accessToken, { sameSite: "none", secure: true });
                res.cookie("rtoken", refreshToken, { sameSite: "none", secure: true });
                //changes for cookie parser end
                res.json({ accessToken: accessToken });
                return [3 /*break*/, 6];
            case 5:
                res.json({ STOP: "Now allowed" });
                console.log("NOT ALLOWED USER DID NOT GET IN");
                _b.label = 6;
            case 6:
                console.log("user found now authenticating");
                _b.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                _a = _b.sent();
                res.json({ failure: "could not login user/db error/network error" });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.get("/logout", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("token has been cleared");
        res.clearCookie("token", {
            sameSite: "none",
            secure: true
        } /*, { domain: "localhost:3000", path: "/user" }*/);
        res.end();
        return [2 /*return*/];
    });
}); });
router.post("/token", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, compareRefreshQuery, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                refreshToken = req.cookies.rtoken;
                if (refreshToken === null) {
                    return [2 /*return*/, res.json({ failure: "no refresh token sent back to server" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, pool.query("SELECT refresh FROM usertable")];
            case 2:
                compareRefreshQuery = _a.sent();
                //await compareRefreshQuery.end();
                //compareRefreshQuery.release();
                if (compareRefreshQuery.rows[0] === refreshToken) {
                    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
                        if (err) {
                            return res.json({ failure: "refresh token failed verification" });
                        }
                        var userObject = { user: req.body.user };
                        var accessToken = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, {
                            expiresIn: "900s"
                        });
                        res.cookie("token", accessToken, { sameSite: "none", secure: true });
                    });
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log("error couldn't find refresh on cookie or couldn't get refresh from database as it does not exist yet");
                res.json({ failure: "could not authenticate refresh token" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
