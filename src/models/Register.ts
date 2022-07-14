const bcrypt = require("bcrypt"); //used to hash our users passwords
const fs = require("fs"); //used to manipulate folders and files
import { checkUsersTwo } from "../services/checkUsers";
import { db } from "../services/db";

class Register {
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

  async registerUser(): Promise<Object> {
    try {
      //first we take the incoming password and hash it
      const hashPassword = await bcrypt.hash(this.#password, 10);
      //then we check to see if username already exist in db
      let userEvaluate: boolean | undefined = await checkUsersTwo(this.#email);
      if (userEvaluate) {
        return { failure: "user account already exists" };
      } else if (userEvaluate === undefined) {
        return { failure: "connection error please try again" };
      } else {
        console.log(userEvaluate);
        db(this.#email, hashPassword);
        console.log("new user account created");
        fs.mkdir(`./uploads/${this.#email}`, (err: Error) => {
          if (err) {
            console.log(err);
            return { failure: "could not save file to path" };
          }
          console.log("directory created successfully");
        });
        return { success: "user account created" };
      }
    } catch (err) {
      console.log(err);
      return { failure: "try block failed excepction caught" };
    }
  }
}

export default Register;
