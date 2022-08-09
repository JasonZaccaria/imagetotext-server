import { Request, Response, Router } from "express";
const router = Router();

const cors = require("cors");
const bcrypt = require("bcrypt");
//const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
import { resolve } from "path";
const fs = require("fs"); //used to manipulate folders and files
const path = require("path");

//below is our pool configuration
//import pool from "../services/pools";
const pool = require("../services/pools");
//function for entering username and password into db
import { db } from "../services/db";
//import for authenticate toke two
import { authenticateTokenTwo } from "../services/authenticateToken";
//import for checkusers
import { checkUsersTwo } from "../services/checkUsers";

//now we will import below our controllers
import registerController from "../controllers/RegisterController";
import loginController from "../controllers/LoginController";

router.get("/auth", authenticateTokenTwo, (req: Request, res: Response) => {
  res.json({ success: "user authenticated" });
});

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/logout", async (req: Request, res: Response) => {
  console.log("token has been cleared");
  res.clearCookie("token", {
    sameSite: "none",
    secure: true,
  });
  res.end();
});

router.post("/token", async (req: Request, res: Response) => {
  //this route is used to send us a new accesstoken by using our refresh token and authenticating with that and then sending a new access token
  const refreshToken = req.cookies.rtoken;
  if (refreshToken === null) {
    return res.json({ failure: "no refresh token sent back to server" });
  }
  try {
    const compareRefreshQuery = await pool.query(
      "SELECT refresh FROM usertable"
    );
    if (compareRefreshQuery.rows[0] === refreshToken) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err: any, user: any) => {
          if (err) {
            return res.json({ failure: "refresh token failed verification" });
          }
          const userObject = { user: req.body.user };
          const accessToken = jwt.sign(
            userObject,
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "900s",
            }
          );
          res.cookie("token", accessToken, { sameSite: "none", secure: true });
        }
      );
    }
  } catch (err) {
    console.log(
      "error couldn't find refresh on cookie or couldn't get refresh from database as it does not exist yet"
    );
    res.json({ failure: "could not authenticate refresh token" });
  }
});

router.get("/halt", (req: Request, res: Response) => {
  let date = new Date();
  date.setTime(date.getTime() + 5 * 60 * 1000);
  res.cookie("halt", "asdfasdf", {
    sameSite: "none",
    secure: true,
    /*maxAge: 300,*/
    expires: date,
  });
  res.json({ success: "halt cookie has been created successfully" });
  res.end();
});

export { router };
