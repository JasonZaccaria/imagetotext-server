"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { resolve } from "path"
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer"); //for multipart form data i need it
const multerS3 = require("multer-s3");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs"); //used to modify folders and files
const path = require("path");
//below are the imports for our router components! we will have to go in here after we are done and add app.use(router OR userDataRouter)
const authRoutes_1 = require("./routes/authRoutes");
const userDataRoutes_1 = require("./routes/userDataRoutes");
//config for s3 bucket
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
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(cors({
    credentials: true,
    origin: true,
    sameSite: "none",
}));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(cookieParser());
//auth
app.use(authRoutes_1.router);
//userroutes
app.use(userDataRoutes_1.userDataRouter);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
