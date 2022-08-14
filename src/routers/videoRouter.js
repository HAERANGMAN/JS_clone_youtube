import express from "express";
import { see, edit, upload, deleteVideo } from "../controllers/videoController";



const videoRouter = express.Router();


videoRouter.get("/upload", upload);
///변수명(정규식) 조합
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);


export default videoRouter;