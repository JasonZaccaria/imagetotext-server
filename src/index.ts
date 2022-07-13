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
//end db

//testing arrays instead of db
let usersArray: string[] = [];
const posts = [
  {
    username: "Kyule",
    title: "Post 1",
  },
  {
    username: "Jim",
    title: "Post 2",
  },
];
//end of testing arrays instead of db

function checkUsers(user: String): boolean {
  let userDuplicate: boolean = false;
  for (let i = 0; i < usersArray.length; i++) {
    if (user === usersArray[i]) {
      userDuplicate = true;
      break;
    }
  }
  return userDuplicate;
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
//created for jwt authorization token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: any, userObject: any) => {
      if (err) return res.sendStatus(403);
      req.user = userObject;
      next();
    }
  );
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

app.get("/auth", authenticateTokenTwo, (req: any, res: any) => {
  res.json({ success: "user authenticated" });
});

app.post("/register", async (req: Request, res: Response) => {
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

app.post("/login", async (req: Request, res: Response) => {
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

app.get("/logout", async (req, res) => {
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

app.post("/token", async (req, res) => {
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

app.get("/data", authenticateTokenTwo, async (req: any, res) => {
  //here we will authenticate user with access token and then we will decide to allow access or not
  //i changed the above function to include any for our req so we can access our req.user value that was blocked by teypescript fro some reasons
  try {
    let userDataArray: any = [];
    //const tetst = await pool.connect(); //gave random name for now but just testing
    const results = await pool.query(
      "SELECT * FROM userposts WHERE email = $1",
      [req.user.user]
    );
    const userTable = results.rows;
    //just added this commit statement below to see if this helps
    //await pool.query("COMMIT");
    //tetst.release(); //i have to release this cleint instance. I shoudl reneame this and the tetst above to client and that shoudl be more claers
    //await tetst.end();
    //results.end();
    async function tester() {
      for (let i = 0; i < userTable.length; i++) {
        let tempData = fs.readFileSync(userTable[i]["file"]);
        let base64 = tempData.toString("base64");
        userDataArray.push([
          userTable[i]["title"],
          userTable[i]["conversion"],
          base64,
          userTable[i]["dates"],
          userTable[i]["mimetypes"],
        ]);
        console.log(userDataArray);
      }
      return userDataArray;
    }

    let datar = await tester();
    console.log(datar);

    //console.log(userDataArray);
    res.json({ image: userDataArray }); //error becuae the reafile is async we need to await it somewhow so we send this after not before
    //changes end here 6/21/2022
  } catch (e) {
    console.log(e);
    res.json({ failure: "could not retrieve userdata from /data route" });
  }
});

app.post("/imageconvert", upload.single("file"), async (req: any, res) => {
  //above we included the multer middleware to allow us to upload a file called file which is passed to req
  //below we call our imageToText function with the path of the downloaded image inside of the uploads folder and return the text as a response
  console.log(req.file);
  const convertedImage: string = await imageToText(req.file["path"]);
  res.json({ success: convertedImage });
});

app.post(
  "/userdata",
  authenticateTokenTwo,
  upload.single("file"),
  async (req: any, res: any) => {
    console.log(req.file); //we need to save user file as an item in a column
    console.log(req.user.user); //we need to save user email as a item in a column
    console.log(req.body.user); //this won't work we need to grab user from authentication middlewar we used
    const userString = req.body.user;
    console.log(req.body.stringConversion);
    console.log(req.body.title);
    console.log(req.body.title);
    console.log(req.body);
    console.log(req.title);
    let dateInMs = new Date();
    console.log(dateInMs.getTime());
    let currentDate = new Date(dateInMs); //we also need to save a timestamp to use for later also in a column
    console.log(currentDate);
    //and lastly we will need to save a conversion post name as a column
    console.log(req.file.path);
    console.log(req.file.mimetype);
    //changes for 6/20/here
    fs.copyFile(
      req.file.path,
      `./uploads/${req.user.user}/${req.file.filename}`,
      (err: any) => {
        if (err) {
          console.log(err);
        }
        console.log("file copied to user directory");
      }
    );
    let copiedFilePath = `uploads/${req.user.user}/${req.file.filename}`;
    //changes for 6/20 end here

    try {
      //const client = await pool.connect();
      const results = await pool.query(
        "INSERT INTO userposts (email, title, conversion, file, dates, mimetypes) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          req.user.user,
          req.body.title,
          req.body.stringConversion,
          /*req.file.path,*/
          copiedFilePath,
          currentDate,
          req.file.mimetype,
        ]
      );
      //results.release();
      const resultTwo = await pool.query("SELECT * FROM userposts");
      console.table(resultTwo.rows);
      //await client.query("COMMIT");
      //client.end();
      //resultTwo.release();
    } catch (e) {
      console.log("error occured");
      console.log(e);
    }
  }
);

app.post("/deletePost", authenticateTokenTwo, async (req: any, res) => {
  let titleOfPost: string = req.body.titleOfPost;
  try {
    //below we grab the file directory from our
    //const client = await pool.connect();
    const results = await pool.query(
      "SELECT file FROM userposts WHERE email = $1 AND title = $2",
      [req.user.user, titleOfPost]
    );
    //results.release();
    console.table(results.rows[0]["file"]);
    let removedPost = results.rows[0]["file"];
    fs.unlinkSync(removedPost);
    //below we are deleting the rows that contain our post's title form our db
    const resultsTwo = await pool.query(
      "DELETE FROM userposts WHERE title = $1",
      [titleOfPost]
    );
    //client.end();
    //resultsTwo.release();
  } catch (e) {
    console.log(e);
  }
  res.json({ success: "content deleted from db" });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
