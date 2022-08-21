import express from "express";
import { watch, getEdit, postEdit, getUpload, postUpload, deleteVideo } from "../controllers/videoController";



const videoRouter = express.Router();



// :변수명(정규식) 조합
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
// 아래 두 줄과 동일함
// videoRouter.get("/:id(\\d+)/edit", getEdit);
// videoRouter.post("/:id(\\d+)/edit", postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo); //16진수의24자리


videoRouter.get("/upload", getUpload); //한줄로도 가능함!
videoRouter.post("/upload", postUpload);


videoRouter.get("/:id(\\d+)/delete", deleteVideo);


export default videoRouter;