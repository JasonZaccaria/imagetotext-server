import Data from "../models/Data";
import { Request, Response } from "express";
//import { authenticateTokenTwo } from "../services/authenticateToken";

const dataController = async (req: any, res: Response) => {
  let callData: Data = new Data(req.user.user);
  let dataResponse: dataObject = await callData.getData();
  if (dataResponse.image) {
    res.json({ image: dataResponse.image });
  }
};

export default dataController;
