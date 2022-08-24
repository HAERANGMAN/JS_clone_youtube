import express from "express";
import { getJoin, postJoin, getLogin, postLogin, } from "../controllers/userController";
import { home, search } from "../controllers/videoController";



const rootRouter = express.Router();

// rootRouter.route("/").get(home); 과같음
rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);


export default rootRouter;