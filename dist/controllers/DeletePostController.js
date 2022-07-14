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
const DeletePost_1 = __importDefault(require("../models/DeletePost"));
const deletePostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let deletePostModel = new DeletePost_1.default(req.user.user, req.body.titleOfPost);
    let deleteUserPosts = yield deletePostModel.deletePosts();
    if (deleteUserPosts.success) {
        res.json({ success: deleteUserPosts.success });
    }
    else {
        res.json({ failure: deleteUserPosts.failure });
    }
});
exports.default = deletePostController;
