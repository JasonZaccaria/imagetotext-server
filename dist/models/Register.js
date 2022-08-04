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
var _Register_email, _Register_password;
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt"); //used to hash our users passwords
const fs = require("fs"); //used to modify folders and files
const checkUsers_1 = require("../services/checkUsers");
const db_1 = require("../services/db");
class Register {
    constructor(email, password) {
        _Register_email.set(this, void 0);
        _Register_password.set(this, void 0);
        __classPrivateFieldSet(this, _Register_email, email, "f");
        __classPrivateFieldSet(this, _Register_password, password, "f");
    }
    get getEmail() {
        return __classPrivateFieldGet(this, _Register_email, "f");
    }
    set setEmail(newEmail) {
        __classPrivateFieldSet(this, _Register_email, newEmail, "f");
    }
    get getPassword() {
        return __classPrivateFieldGet(this, _Register_password, "f");
    }
    set setPassword(newPassword) {
        __classPrivateFieldSet(this, _Register_password, newPassword, "f");
    }
    registerUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //first we take the incoming password and hash it
                const hashPassword = yield bcrypt.hash(__classPrivateFieldGet(this, _Register_password, "f"), 10);
                //then we check to see if username already exist in db
                let userEvaluate = yield (0, checkUsers_1.checkUsersTwo)(__classPrivateFieldGet(this, _Register_email, "f"));
                if (userEvaluate) {
                    return { failure: "user account already exists" };
                }
                else if (userEvaluate === undefined) {
                    return { failure: "connection error please try again" };
                }
                else {
                    console.log(userEvaluate);
                    (0, db_1.db)(__classPrivateFieldGet(this, _Register_email, "f"), hashPassword);
                    console.log("new user account created");
                    fs.mkdir(`./uploads/${__classPrivateFieldGet(this, _Register_email, "f")}`, (err) => {
                        if (err) {
                            console.log(err);
                            return { failure: "could not save file to path" };
                        }
                        console.log("directory created successfully");
                    });
                    return { success: "user account created" };
                }
            }
            catch (err) {
                console.log(err);
                return { failure: "try block failed excepction caught" };
            }
        });
    }
}
_Register_email = new WeakMap(), _Register_password = new WeakMap();
exports.default = Register;
