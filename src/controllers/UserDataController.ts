import UserData from "../models/UserData";
import { Request, Response } from "express";
import { userDataObject } from "../services/Types";

const userDataController = async (req: any, res: Response) => {
  let userDataModel: UserData = new UserData(
    req.user.user,
    req.body.title,
    req.body.stringConversion,
    /*req.file.filename,*/
    req.file.originalname,
    /*req.file.path,*/
    req.file.location,
    req.file.mimetype
  );

  let userDataModelResponse: userDataObject = await userDataModel.saveData();
  if (userDataModelResponse.success) {
    res.json({ success: userDataModelResponse.success });
  } else {
    res.json({ failure: userDataModelResponse.failure });
  }
};

export default userDataController;
