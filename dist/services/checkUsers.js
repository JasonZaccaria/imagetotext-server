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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsersTwo = void 0;
const pools_1 = require("./pools");
function checkUsersTwo(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let userDuplicate = false;
        try {
            console.log("connected successfully");
            const results = yield pools_1.pool.query("SELECT email FROM usertable WHERE email = $1", [user]);
            //testing what happens when unknown user is here
            console.log(results.rows);
            if (results.rows.length === 0) {
                console.log("no users with same name could be found");
                userDuplicate = false;
                return userDuplicate;
            }
            else if (results.rows.length === 1) {
                console.log("user with same email already in system");
                userDuplicate = true;
                return userDuplicate;
            }
        }
        catch (err) {
            console.log("error could not query database | or could mean that no other user exitst so far so userDuplicate will equal false");
            console.log(err);
            return undefined;
        }
    });
}
exports.checkUsersTwo = checkUsersTwo;
