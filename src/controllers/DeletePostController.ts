import DeletePost from "../models/DeletePost";
import { Request, Response } from "express";
import { deletePostObject } from "../services/Types";

const deletePostController = async (req: any, res: Response) => {
  let deletePostModel = new DeletePost(req.user.user, req.body.titleOfPost);
  let deleteUserPosts: deletePostObject = await deletePostModel.deletePosts();
  if (deleteUserPosts.success) {
    res.json({ success: deleteUserPosts.success });
  } else {
    res.json({ failure: deleteUserPosts.failure });
  }
};

export default deletePostController;
