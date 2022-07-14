import { NONAME } from "dns";
import imageToText from "./services/textGenerator";
import express, {
  Express,
  Application,
  Request,
  Response,
  NextFunction,
} from "express";
import { resolve } from "path";
//import dotenv from "dotenv";
require("dotenv").config(); //CHANGES MADE BECAUSE ABOVE IMPORT NOT WORKING ON JWT AUTHORIZATION
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer"); //for multipart form data i need it
const fs = require("fs"); //used to manipulate folders and files
const path = require("path");
/*below are the imports for our router components! we will have to go in here after we are done and add app.use(router OR userDataRouter)*/
import { router } from "./routes/authRoutes";
import { userDataRouter } from "./routes/userDataRoutes";

//changes for multer adding in disk storage
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "uploads/");
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname /*+ "-" + uniqueSuffix*/);
  },
});
//end of changes for multer disk storage
//let upload = multer({ dest: "uploads/" }); //for multipart form data i need it
let upload = multer({ storage: storage });

//dotenv.config();
//https://blog.logrocket.com/how-to-set-up-node-typescript-express/

const app: Application = express();
const port = 8000; //process.env.PORT;

app.use(
  cors({
    credentials: true,
    origin: true,
    sameSite: "none",
    //origin: "localhost:3000/login",
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
//app.use(upload.array());
//app.use(express.static("public"));

//here we will set up db

//auth
app.use(router);

//userroutes
app.use(userDataRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
