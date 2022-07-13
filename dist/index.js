"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
//dotenv.config();
//https://blog.logrocket.com/how-to-set-up-node-typescript-express/
const app = (0, express_1.default)();
const port = 8000; //process.env.PORT;
//const cors = require("cors");
app.use(cors());
app.use(express_1.default.json());
//const bcrypt = require("bcrypt");
//here we will set up db

function db(userEmail, userPassword) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      yield pool.connect();
      console.log("conneccted successfully");
      const results = yield pool.query(
        "INSERT INTO usertable(email, password) VALUES($1, $2)",
        [userEmail, userPassword]
      );
      const resultTwo = yield pool.query("SELECT * FROM usertable");
      console.table(resultTwo.rows);
      yield pool.query("COMMIT");
      //await pool.end(); CHANGE
      console.log("client disconnected");
    } catch (e) {
      console.log(`failed to execute ${e}`);
    }
  });
}
//end db
let usersArray = [];
function checkUsers(user) {
  let userDuplicate = false;
  for (let i = 0; i < usersArray.length; i++) {
    if (user === usersArray[i]) {
      userDuplicate = true;
      break;
    }
  }
  return userDuplicate;
}
function checkUsersTwo(user) {
  return __awaiter(this, void 0, void 0, function* () {
    let userDuplicate = false;
    try {
      yield pool.connect();
      console.log("connected successfully");
      const results = yield pool.query(
        "SELECT email FROM usertable WHERE email = $1",
        [user]
      );
      //await pool.end(); CHANGE
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
  });
}
app.post("/register", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const hashedPassword = yield bcrypt.hash(req.body.pass, 10);
      //now we can push an object with our username and hashedpassword to db
      let userEvaluate = yield checkUsersTwo(req.body.user);
      if (userEvaluate) {
        console.log(userEvaluate);
        res.json({ failure: "user account already exists" });
      } else if (userEvaluate === undefined) {
        console.log(userEvaluate);
        res.json({ failue: "connection error please try again" });
      } else {
        //changes here
        console.log(userEvaluate);
        db(req.body.user, hashedPassword);
        //changes end
        console.log("new user account created");
        res.json({ success: 200 });
      }
    } catch (_a) {
      res.json({ failure: 500 });
      console.log("failed to register profile");
    }
  })
);
app.post("/login", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield pool.connect();
      console.log("connected to db successfully");
      const userQuery = yield pool.query(
        "SELECT * FROM usertable WHERE email = $1",
        [req.body.user]
      ); //CHANGE email to *
      //testing here start
      console.table(userQuery.rows);
      //testing here end
      if (userQuery.rows.length === 0) {
        res.json({ failure: "account not found" });
        console.log("account not found");
      } else if (userQuery.rows.length === 1) {
        if (yield bcrypt.compare(req.body.password, req.body.pass)) {
          res.json({ success: "user is now logged in" });
          console.log("SUCCESS USER IS NOW LOGGED IN");
        } else {
          res.json({ STOP: "Now allowed" });
          console.log("NOT ALLOWED USER DID NOT GET IN");
        }
        console.log("user found now authenticating");
      }
    } catch (_b) {
      res.json({ failure: "could not login user/db error/network error" });
    }
    //first we need to check for username
    //const user = users.find(user => user.name = req.body.user);
    //if (user === null) {
    //return res.status(400).send('cannot find user');
    //}
    //now we can set up try catch to compare our passwords
    //try {
    //if (await bcrypt.compare(req.body.pass, user.pass)) {
    //res.send("success");
    //}
    //else {
    //res.send("not allowed");
    //}
    //}
    //catch {
    //res.status(500).send();
    //}
  })
);
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
