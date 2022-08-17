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
const UserData_1 = __importDefault(require("../models/UserData"));
const userDataController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userDataModel = new UserData_1.default(req.user.user, req.body.title, req.body.stringConversion, 
    /*req.file.filename,*/
    req.file.originalname, 
    /*req.file.path,*/
    req.file.location, req.file.mimetype);
    let userDataModelResponse = yield userDataModel.saveData();
    if (userDataModelResponse.success) {
        res.json({ success: userDataModelResponse.success });
    }
    else {
        res.json({ failure: userDataModelResponse.failure });
    }
});
exports.default = userDataController;
