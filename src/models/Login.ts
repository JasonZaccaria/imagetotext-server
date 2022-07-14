import { pool } from "../services/pool";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class Login {
  #email: string;
  #password: string;

  constructor(email: string, password: string) {
    this.#email = email;
    this.#password = password;
  }

  get getEmail(): string {
    return this.#email;
  }

  set setEmail(newEmail: string) {
    this.#email = newEmail;
  }

  get getPassword(): string {
    return this.#password;
  }

  set setPassword(newPassword: string) {
    this.#password = newPassword;
  }

  async loginUser(): Promise<loginObject> {
    try {
      const userQuery = await pool.query(
        "SELECT * FROM usertable WHERE email = $1",
        [this.#email]
      );
      console.log("connected to db successfully");
      if (userQuery.rows.length === 0) {
        console.log("account not found");
        return { failure: "account not found " };
      } else if (userQuery.rows.length === 1) {
        const userEmail = userQuery.rows[0]["email"];
        const userPass = userQuery.rows[0]["password"];
        if (await bcrypt.compare(this.#password, userPass)) {
          console.log("SUCCESS USER IS NOW LOGGED IN");
          const userObject = { user: this.#email };
          const accessToken = jwt.sign(
            userObject,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "900s" }
          );
          const refreshToken = jwt.sign(
            userObject,
            process.env.REFRESH_TOKEN_SECRET
          );
          const refreshQuery = await pool.query(
            "UPDATE usertable SET refresh = $1 WHERE email = $2",
            [refreshToken, this.#email]
          );
          return { token: accessToken, rtoken: refreshToken };
        } else {
          console.log("NOT ALLOWED USER DID NOT GET IN");
          return { STOP: "NOT ALLOWED" };
        }
      }
    } catch (err) {
      return { failure: "could not login user/db error/network error" };
    }
    return { function: "finished" };
  }
}

export default Login;
