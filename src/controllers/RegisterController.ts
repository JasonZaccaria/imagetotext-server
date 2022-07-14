import Register from "../models/Register";
import { Request, Response } from "express";

const registerController = async (req: Request, res: Response) => {
  let callRegister: Register = new Register(req.body.user, req.body.pass);
  let getResponse: Object = await callRegister.registerUser();
  res.json(getResponse);
};

export default registerController;
