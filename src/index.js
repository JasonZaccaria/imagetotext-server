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
var textGenerator_1 = require("./services/textGenerator");
var express_1 = require("express");
//import dotenv from "dotenv";
require("dotenv").config(); //CHANGES MADE BECAUSE ABOVE IMPORT NOT WORKING ON JWT AUTHORIZATION
var cors = require("cors");
var bcrypt = require("bcrypt");
var Pool = require("pg").Pool;
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
var multer = require("multer"); //for multipart form data i need it
var fs = require("fs"); //used to manipulate folders and files
var path = require("path");
//changes for multer adding in disk storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname /*+ "-" + uniqueSuffix*/);
    }
});
//end of changes for multer disk storage
//let upload = multer({ dest: "uploads/" }); //for multipart form data i need it
var upload = multer({ storage: storage });
//dotenv.config();
//https://blog.logrocket.com/how-to-set-up-node-typescript-express/
var app = (0, express_1["default"])();
var port = 8000; //process.env.PORT;
app.use(cors({
    credentials: true,
    origin: true,
    sameSite: "none"
}));
app.use(express_1["default"].json({ limit: "50mb" }));
app.use(cookieParser());
//app.use(upload.array());
//app.use(express.static("public"));
//here we will set up db
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
//end db
//testing arrays instead of db
var usersArray = [];
var posts = [
    {
        username: "Kyule",
        title: "Post 1"
    },
    {
        username: "Jim",
        title: "Post 2"
    },
];
//end of testing arrays instead of db
function checkUsers(user) {
    var userDuplicate = false;
    for (var i = 0; i < usersArray.length; i++) {
        if (user === usersArray[i]) {
            userDuplicate = true;
            break;
        }
    }
    return userDuplicate;
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
//created for jwt authorization token
function authenticateToken(req, res, next) {
    var authHeader = req.headers["authorization"];
    var token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, userObject) {
        if (err)
            return res.sendStatus(403);
        req.user = userObject;
        next();
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
app.get("/auth", authenticateTokenTwo, function (req, res) {
    res.json({ success: "user authenticated" });
});
app.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
app.get("/logout", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
app.post("/token", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
app.get("/data", authenticateTokenTwo, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    //just added this commit statement below to see if this helps
    //await pool.query("COMMIT");
    //tetst.release(); //i have to release this cleint instance. I shoudl reneame this and the tetst above to client and that shoudl be more claers
    //await tetst.end();
    //results.end();
    function tester() {
        return __awaiter(this, void 0, void 0, function () {
            var i, tempData, base64;
            return __generator(this, function (_a) {
                for (i = 0; i < userTable_1.length; i++) {
                    tempData = fs.readFileSync(userTable_1[i]["file"]);
                    base64 = tempData.toString("base64");
                    userDataArray_1.push([
                        userTable_1[i]["title"],
                        userTable_1[i]["conversion"],
                        base64,
                        userTable_1[i]["dates"],
                        userTable_1[i]["mimetypes"],
                    ]);
                    console.log(userDataArray_1);
                }
                return [2 /*return*/, userDataArray_1];
            });
        });
    }
    var userDataArray_1, results, userTable_1, datar, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userDataArray_1 = [];
                return [4 /*yield*/, pool.query("SELECT * FROM userposts WHERE email = $1", [req.user.user])];
            case 1:
                results = _a.sent();
                userTable_1 = results.rows;
                return [4 /*yield*/, tester()];
            case 2:
                datar = _a.sent();
                console.log(datar);
                //console.log(userDataArray);
                res.json({ image: userDataArray_1 }); //error becuae the reafile is async we need to await it somewhow so we send this after not before
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                console.log(e_2);
                res.json({ failure: "could not retrieve userdata from /data route" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/imageconvert", upload.single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var convertedImage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                //above we included the multer middleware to allow us to upload a file called file which is passed to req
                //below we call our imageToText function with the path of the downloaded image inside of the uploads folder and return the text as a response
                console.log(req.file);
                return [4 /*yield*/, (0, textGenerator_1["default"])(req.file["path"])];
            case 1:
                convertedImage = _a.sent();
                res.json({ success: convertedImage });
                return [2 /*return*/];
        }
    });
}); });
app.post("/userdata", authenticateTokenTwo, upload.single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userString, dateInMs, currentDate, copiedFilePath, results, resultTwo, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.file); //we need to save user file as an item in a column
                console.log(req.user.user); //we need to save user email as a item in a column
                console.log(req.body.user); //this won't work we need to grab user from authentication middlewar we used
                userString = req.body.user;
                console.log(req.body.stringConversion);
                console.log(req.body.title);
                console.log(req.body.title);
                console.log(req.body);
                console.log(req.title);
                dateInMs = new Date();
                console.log(dateInMs.getTime());
                currentDate = new Date(dateInMs);
                console.log(currentDate);
                //and lastly we will need to save a conversion post name as a column
                console.log(req.file.path);
                console.log(req.file.mimetype);
                //changes for 6/20/here
                fs.copyFile(req.file.path, "./uploads/".concat(req.user.user, "/").concat(req.file.filename), function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("file copied to user directory");
                });
                copiedFilePath = "uploads/".concat(req.user.user, "/").concat(req.file.filename);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, pool.query("INSERT INTO userposts (email, title, conversion, file, dates, mimetypes) VALUES ($1, $2, $3, $4, $5, $6)", [
                        req.user.user,
                        req.body.title,
                        req.body.stringConversion,
                        /*req.file.path,*/
                        copiedFilePath,
                        currentDate,
                        req.file.mimetype,
                    ])];
            case 2:
                results = _a.sent();
                return [4 /*yield*/, pool.query("SELECT * FROM userposts")];
            case 3:
                resultTwo = _a.sent();
                console.table(resultTwo.rows);
                return [3 /*break*/, 5];
            case 4:
                e_3 = _a.sent();
                console.log("error occured");
                console.log(e_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post("/deletePost", authenticateTokenTwo, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var titleOfPost, results, removedPost, resultsTwo, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                titleOfPost = req.body.titleOfPost;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, pool.query("SELECT file FROM userposts WHERE email = $1 AND title = $2", [req.user.user, titleOfPost])];
            case 2:
                results = _a.sent();
                //results.release();
                console.table(results.rows[0]["file"]);
                removedPost = results.rows[0]["file"];
                fs.unlinkSync(removedPost);
                return [4 /*yield*/, pool.query("DELETE FROM userposts WHERE title = $1", [titleOfPost])];
            case 3:
                resultsTwo = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_4 = _a.sent();
                console.log(e_4);
                return [3 /*break*/, 5];
            case 5:
                res.json({ success: "content deleted from db" });
                return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at https://localhost:".concat(port));
});
