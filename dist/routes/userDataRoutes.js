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
exports.userDataRouter = void 0;
const express_1 = require("express");
const authenticateToken_1 = require("../services/authenticateToken");
const DataController_1 = __importDefault(require("../controllers/DataController"));
const UserDataController_1 = __importDefault(require("../controllers/UserDataController"));
const DeletePostController_1 = __importDefault(require("../controllers/DeletePostController"));
const textGenerator_1 = __importDefault(require("../services/textGenerator"));
const multer = require("multer"); //for multipart form data i need it
const userDataRouter = (0, express_1.Router)();
exports.userDataRouter = userDataRouter;
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
userDataRouter.get("/data", authenticateToken_1.authenticateTokenTwo, DataController_1.default);
userDataRouter.post("/imageconvert", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //above we included the multer middleware to allow us to upload a file called file which is passed to req
    //below we call our imageToText function with the path of the downloaded image inside of the uploads folder and return the text as a response
    console.log(req.file);
    const convertedImage = yield (0, textGenerator_1.default)(req.file["path"]);
    res.json({ success: convertedImage });
}));
userDataRouter.post("/userdata", authenticateToken_1.authenticateTokenTwo, upload.single("file"), UserDataController_1.default);
userDataRouter.post("/deletePost", authenticateToken_1.authenticateTokenTwo, DeletePostController_1.default);
