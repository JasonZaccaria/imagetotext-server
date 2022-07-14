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
var _Data_email;
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = require("../services/pool");
const fs = require("fs"); //used to manipulate folders and files
//this class retrieves the data from the db and sends it back to the user
class Data {
    constructor(email) {
        _Data_email.set(this, void 0);
        __classPrivateFieldSet(this, _Data_email, email, "f");
    }
    get getEmail() {
        return __classPrivateFieldGet(this, _Data_email, "f");
    }
    set setEmail(newEmail) {
        __classPrivateFieldSet(this, _Data_email, newEmail, "f");
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userDataArray = [];
                const results = yield pool_1.pool.query("SELECT * FROM userposts WHERE email = $1", [__classPrivateFieldGet(this, _Data_email, "f")]);
                const userTable = results.row;
                function enterData() {
                    return __awaiter(this, void 0, void 0, function* () {
                        for (let i = 0; i < userTable.length; i++) {
                            let tempData = fs.readFileSync(userTable[i]["file"]);
                            let base64 = tempData.toString("base64");
                            userDataArray.push([
                                userTable[i]["title"],
                                userTable[i]["conversion"],
                                base64,
                                userTable[i]["dates"],
                                userTable[i]["mimetypes"],
                            ]);
                            console.log(userDataArray);
                        }
                        return userDataArray;
                    });
                }
                let data = yield enterData();
                console.log(data);
                return { image: userDataArray };
            }
            catch (err) {
                console.log(err);
                return { failure: "could not retrieve userdata from database" };
            }
        });
    }
}
_Data_email = new WeakMap();
exports.default = Data;
