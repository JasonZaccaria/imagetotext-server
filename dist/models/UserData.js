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
var _UserData_email, _UserData_title, _UserData_stringConversion, _UserData_filename, _UserData_path, _UserData_copiedFilePath, _UserData_currentDate, _UserData_mimetype;
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = require("../services/pool");
const multer = require("multer");
const fs = require("fs"); //used to manipulate folders and files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname /*+ "-" + uniqueSuffix*/);
    },
});
let upload = multer({ storage: storage });
class UserData {
    constructor(email, title, stringConversion, 
    //copiedFilePath: string,
    filename, //new
    path, 
    //currentDate: string,
    mimetype) {
        _UserData_email.set(this, void 0);
        _UserData_title.set(this, void 0);
        _UserData_stringConversion.set(this, void 0);
        _UserData_filename.set(this, void 0);
        _UserData_path.set(this, void 0);
        _UserData_copiedFilePath.set(this, void 0);
        _UserData_currentDate.set(this, new Date());
        _UserData_mimetype.set(this, void 0);
        __classPrivateFieldSet(this, _UserData_email, email, "f");
        __classPrivateFieldSet(this, _UserData_title, title, "f");
        __classPrivateFieldSet(this, _UserData_stringConversion, stringConversion, "f");
        __classPrivateFieldSet(this, _UserData_path, path, "f");
        __classPrivateFieldSet(this, _UserData_copiedFilePath, `uploads/${email}/${filename}`, "f");
        __classPrivateFieldSet(this, _UserData_filename, filename, "f");
        //this.#currentDate = currentDate;
        __classPrivateFieldSet(this, _UserData_mimetype, mimetype, "f");
    }
    get getEmail() {
        return __classPrivateFieldGet(this, _UserData_email, "f");
    }
    set setEmail(newEmail) {
        __classPrivateFieldSet(this, _UserData_email, newEmail, "f");
    }
    get getTitle() {
        return __classPrivateFieldGet(this, _UserData_title, "f");
    }
    set setTitle(newTitle) {
        __classPrivateFieldSet(this, _UserData_title, newTitle, "f");
    }
    get getStringConversion() {
        return __classPrivateFieldGet(this, _UserData_stringConversion, "f");
    }
    set setStringConversion(newStringConversion) {
        __classPrivateFieldSet(this, _UserData_stringConversion, newStringConversion, "f");
    }
    get getFilename() {
        return __classPrivateFieldGet(this, _UserData_filename, "f");
    }
    set setFilename(newFilename) {
        __classPrivateFieldSet(this, _UserData_filename, newFilename, "f");
    }
    get getPath() {
        return __classPrivateFieldGet(this, _UserData_path, "f");
    }
    set setPath(newPath) {
        __classPrivateFieldSet(this, _UserData_path, newPath, "f");
    }
    get getCopiedFilePath() {
        return __classPrivateFieldGet(this, _UserData_copiedFilePath, "f");
    }
    set setCopiedFilePath(newCopiedFilePath) {
        __classPrivateFieldSet(this, _UserData_copiedFilePath, newCopiedFilePath, "f");
    }
    get getCurrentDate() {
        return __classPrivateFieldGet(this, _UserData_currentDate, "f");
    }
    set setCurrentDate(newCurrentDate) {
        __classPrivateFieldSet(this, _UserData_currentDate, newCurrentDate, "f");
    }
    get getMimetype() {
        return __classPrivateFieldGet(this, _UserData_mimetype, "f");
    }
    set setMimetype(newMimetype) {
        __classPrivateFieldSet(this, _UserData_mimetype, newMimetype, "f");
    }
    saveData() {
        return __awaiter(this, void 0, void 0, function* () {
            let dateInMis = new Date();
            __classPrivateFieldSet(this, _UserData_currentDate, new Date(dateInMis), "f");
            fs.copyFile(__classPrivateFieldGet(this, _UserData_path, "f"), `./uploads/${__classPrivateFieldGet(this, _UserData_email, "f")}/${__classPrivateFieldGet(this, _UserData_filename, "f")}`, (err) => {
                if (err) {
                    console.log(err);
                }
                console.log("file copied to user directory");
            });
            //let copiedFilePath = `uploads/${req.user.user}/${req.file.filename}`;
            try {
                const results = pool_1.pool.query("INSERT INTO userposts (email, title, conversion, file, dates, mimetypes) VALUES ($1, $2, $3, $4, $5, $6)", [
                    __classPrivateFieldGet(this, _UserData_email, "f"),
                    __classPrivateFieldGet(this, _UserData_title, "f"),
                    __classPrivateFieldGet(this, _UserData_stringConversion, "f"),
                    /*req.file.path,*/
                    __classPrivateFieldGet(this, _UserData_copiedFilePath, "f"),
                    __classPrivateFieldGet(this, _UserData_currentDate, "f"),
                    __classPrivateFieldGet(this, _UserData_mimetype, "f"),
                ]);
                const resultTwo = yield pool_1.pool.query("SELECT * FROM userposts");
                console.table(resultTwo.rows);
                return { success: "data inserted into db" };
            }
            catch (err) {
                console.log("error occured");
                console.log(err);
                return { failure: "data could not be added to db" };
            }
        });
    }
}
_UserData_email = new WeakMap(), _UserData_title = new WeakMap(), _UserData_stringConversion = new WeakMap(), _UserData_filename = new WeakMap(), _UserData_path = new WeakMap(), _UserData_copiedFilePath = new WeakMap(), _UserData_currentDate = new WeakMap(), _UserData_mimetype = new WeakMap();
exports.default = UserData;
