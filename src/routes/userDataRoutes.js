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
exports.userDataRouter = void 0;
var express_1 = require("express");
var userDataRouter = (0, express_1.Router)();
exports.userDataRouter = userDataRouter;
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
    var userDataArray_1, results, userTable_1, datar, e_1;
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
                e_1 = _a.sent();
                console.log(e_1);
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
                return [4 /*yield*/, imageToText(req.file["path"])];
            case 1:
                convertedImage = _a.sent();
                res.json({ success: convertedImage });
                return [2 /*return*/];
        }
    });
}); });
app.post("/userdata", authenticateTokenTwo, upload.single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userString, dateInMs, currentDate, copiedFilePath, results, resultTwo, e_2;
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
                e_2 = _a.sent();
                console.log("error occured");
                console.log(e_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post("/deletePost", authenticateTokenTwo, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var titleOfPost, results, removedPost, resultsTwo, e_3;
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
                e_3 = _a.sent();
                console.log(e_3);
                return [3 /*break*/, 5];
            case 5:
                res.json({ success: "content deleted from db" });
                return [2 /*return*/];
        }
    });
}); });
