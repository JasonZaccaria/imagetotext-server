import { Request, Response, Router } from "express";
const router = Router();

const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
import { resolve } from "path";
const fs = require("fs"); //used to manipulate folders and files
const path = require("path");

//below is our pool configuration
const pool = new Pool({
  user: "postgres",
  password: "ILTPvGaWA@1",
  host: "localhost",
  port: 5432,
  database: "imagetotext",
  max: 10, //was 20
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  allowExitOnIdle: true,
  /*statement_timeout: 30000,
    query_timeout: 30000,
    connectionTimeoutMillis: 30000,*/
});

pool.on("error", (err: any, client: any) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

//function for entering username and password into db
async function db(userEmail: any, userPassword: any): Promise<void> {
  try {
    //const client = await pool.connect();
    console.log("conneccted successfully");
    const results = await pool.query(
      "INSERT INTO usertable(email, password) VALUES($1, $2)",
      [userEmail, userPassword]
    );
    const resultTwo = await pool.query("SELECT * FROM usertable");
    console.table(resultTwo.rows);
    //await client.query("COMMIT");
    //await pool.end(); CHANGE
    /*adding client.end()*/
    //client.end();
    //results.release();
    console.log("client disconnected");
  } catch (e) {
    console.log(`failed to execute ${e}`);
  }
}

//second possible jwt cookie authentication method below... Above is the one by web dev simplified
function authenticateTokenTwo(req: any, res: any, next: any) {
  const token = req.cookies.token;
  console.log(token);
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    console.log(req.user); //here we can view the actual user email which is interesting
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.json({ failure: "invalid token and jwt token cookie cleared" });
  }
}

async function checkUsersTwo(user: string): Promise<boolean | undefined> {
  let userDuplicate: boolean = false;
  try {
    //const client = await pool.connect();
    console.log("connected successfully");
    const results = await pool.query(
      "SELECT email FROM usertable WHERE email = $1",
      [user]
    );
    //results.release();
    //await pool.end(); CHANGE
    //client.end();
    //more changes start
    //testing what happens when unknown user is here
    console.log(results.rows);
    if (results.rows.length === 0) {
      console.log("no users with same name could be found");
      userDuplicate = false;
      return userDuplicate;
    } else if (results.rows.length === 1) {
      console.log("user with same email already in system");
      userDuplicate = true;
      return userDuplicate;
    }
  } catch (err) {
    console.log(
      "error could not query database | or could mean that no other user exitst so far so userDuplicate will equal false"
    );
    console.log(err);
    return undefined;
  }
}

router.get("/auth", authenticateTokenTwo, (req: Request, res: Response) => {
  res.json({ success: "user authenticated" });
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.pass, 10);
    //now we can push an object with our username and hashedpassword to db
    let userEvaluate: boolean | undefined = await checkUsersTwo(req.body.user);
    if (userEvaluate) {
      console.log(userEvaluate);
      res.json({ failure: "user account already exists" });
    } else if (userEvaluate === undefined) {
      console.log(userEvaluate);
      res.json({ failure: "connection error please try again" });
    } else {
      //changes here
      console.log(userEvaluate);
      db(req.body.user, hashedPassword);
      //changes end
      console.log("new user account created");
      //changes on 6/20 here
      fs.mkdir(`./uploads/${req.body.user}`, (err: any) => {
        if (err) {
          return console.log(err);
        }
        console.log("directory created successfully!");
      });
      //changes on 6/20 end here
      res.json({ success: 200 });
    }
  } catch {
    res.json({ failure: 500 });
    console.log("failed to register profile");
  }
});

router.post("/login", async (req: Request, res: Response) => {
  //const client = await pool.connect();
  try {
    //here we compare username from sent to use and see if its in our db
    //const client = await pool.connect();
    console.log("connected to db successfully");
    const userQuery = await pool.query(
      "SELECT * FROM usertable WHERE email = $1",
      [req.body.user]
    ); //CHANGE email to *
    //userQuery.release(); //changed 7/12
    //now we test to see if any results come back and if not we return a failure message
    if (userQuery.rows.length === 0) {
      res.json({ failure: "account not found" });
      console.log("account not found");
    } else if (userQuery.rows.length === 1) {
      //here we are saving our email and password from database as variables to use for bcrypt compare
      const userEmail = userQuery.rows[0]["email"];
      const userPass = userQuery.rows[0]["password"];
      //userQuery.release();
      //below we test our hashed password with our users input to test for truth value
      if (await bcrypt.compare(req.body.pass, userPass)) {
        //res.json({ success: "user is now logged in" }); CHANGE FOR NOW JWT NEEDS to res.json our auth token
        console.log("SUCCESS USER IS NOW LOGGED IN");
        //authorization jwt starts here
        const userObject = { user: req.body.user };
        const accessToken = jwt.sign(
          userObject,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "900s" }
        );
        const refreshToken = jwt.sign(
          userObject,
          process.env.REFRESH_TOKEN_SECRET
        );
        //here I am storing our REFRESH token inside of our database upon successful login and sending the refersh as a cookie to client
        const refreshQuery = await pool.query(
          "UPDATE usertable SET refresh = $1 WHERE email = $2",
          [refreshToken, req.body.user]
        );
        //client.release(); //just modified 7/12
        //client.end();
        //changes for cookie parser start
        //refreshQuery.release();
        res.cookie("token", accessToken, { sameSite: "none", secure: true });
        res.cookie("rtoken", refreshToken, { sameSite: "none", secure: true });
        //changes for cookie parser end
        res.json({ accessToken: accessToken });
        //authorization jwt ends here
      } else {
        res.json({ STOP: "Now allowed" });
        console.log("NOT ALLOWED USER DID NOT GET IN");
      }
      console.log("user found now authenticating");
    }
  } catch {
    res.json({ failure: "could not login user/db error/network error" });
  }
});

router.get("/logout", async (req: Request, res: Response) => {
  console.log("token has been cleared");
  res.clearCookie(
    "token",
    {
      sameSite: "none",
      secure: true,
    } /*, { domain: "localhost:3000", path: "/user" }*/
  );
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
    //await compareRefreshQuery.end();
    //compareRefreshQuery.release();
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

export { router };
