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
var _DeletePost_email, _DeletePost_titleOfPost;
Object.defineProperty(exports, "__esModule", { value: true });
//import pool from "../services/pools";
const pool = require("../services/pools");
const fs = require("fs"); //used to modify folders and files
const { S3Client, GetObjectCommand, DeleteObjectCommand, } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = {
    bucketName: process.env.AWS_BUCKET_NAME,
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
};
const s3 = new S3Client(config);
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, "uploads/" + Date.now().toString() + "-" + file.originalname);
        },
    }),
});
class DeletePost {
    constructor(email, titleOfPost) {
        _DeletePost_email.set(this, void 0);
        _DeletePost_titleOfPost.set(this, void 0);
        __classPrivateFieldSet(this, _DeletePost_email, email, "f");
        __classPrivateFieldSet(this, _DeletePost_titleOfPost, titleOfPost, "f");
    }
    get getEmail() {
        return __classPrivateFieldGet(this, _DeletePost_email, "f");
    }
    set setEmail(newEmail) {
        __classPrivateFieldSet(this, _DeletePost_email, newEmail, "f");
    }
    get getTitleOfPost() {
        return __classPrivateFieldGet(this, _DeletePost_titleOfPost, "f");
    }
    set setTitleOfPost(newTitleOfPost) {
        __classPrivateFieldSet(this, _DeletePost_titleOfPost, newTitleOfPost, "f");
    }
    deletePosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield pool.query("SELECT file FROM userposts WHERE email = $1 AND title = $2", [__classPrivateFieldGet(this, _DeletePost_email, "f"), __classPrivateFieldGet(this, _DeletePost_titleOfPost, "f")]);
                console.table(results.rows[0]["file"]);
                let removedPost = results.rows[0]["file"];
                /*fs.unlinkSync(removedPost);*/
                //insert logic for deleting post
                let getFileOptions = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: removedPost,
                };
                //const getFile = new GetObjectCommand(getFileOptions);
                const getFile = new DeleteObjectCommand(getFileOptions);
                const response = yield s3.send(getFile);
                const resultsTwo = yield pool.query("DELETE FROM userposts WHERE title = $1", [__classPrivateFieldGet(this, _DeletePost_titleOfPost, "f")]);
                return { success: "content has been sucessfully deleted" };
            }
            catch (err) {
                console.log(err);
                return { failure: "content could not be deleted" };
            }
        });
    }
}
_DeletePost_email = new WeakMap(), _DeletePost_titleOfPost = new WeakMap();
exports.default = DeletePost;
