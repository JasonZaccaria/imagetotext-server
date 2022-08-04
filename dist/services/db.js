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
exports.db = void 0;
const pool_1 = require("./pool");
function db(userEmail, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //const client = await pool.connect();
            console.log("conneccted successfully");
            const results = yield pool_1.pool.query("INSERT INTO usertable(email, password) VALUES($1, $2)", [userEmail, userPassword]);
            const resultTwo = yield pool_1.pool.query("SELECT * FROM usertable");
            console.table(resultTwo.rows);
            console.log("client disconnected");
        }
        catch (e) {
            console.log(`failed to execute ${e}`);
        }
    });
}
exports.db = db;
