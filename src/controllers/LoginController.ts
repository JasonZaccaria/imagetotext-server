import Login from "../models/Login";
import { Request, Response } from "express";
import { loginObject } from "../services/Types";

const loginController = async (req: Request, res: Response) => {
  let callLogin: Login = new Login(req.body.user, req.body.pass);
  let getLoginResponse: loginObject = await callLogin.loginUser();
  let accessToken: string | undefined = getLoginResponse.token;
  let refreshToken: string | undefined = getLoginResponse.rtoken;
  if (accessToken) {
    res.cookie("token", accessToken, { sameSite: "none", secure: true });
    res.cookie("rtoken", refreshToken, { sameSite: "none", secure: true });
    res.json({ accessToken: accessToken });
  } else {
    res.json({ failure: "could not login user/db error/network error" });
  }
};

export default loginController;
