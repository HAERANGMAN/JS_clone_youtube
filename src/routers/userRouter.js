import express from "express";
import { getEdit, postEdit, logout, see, startGithubLogin,
        finishGithubLogin, getChangePassword, postChangePassword} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, uploadFiles} from "../middlewares";


const userRouter = express.Router();


userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(uploadFiles.single("avartar"), postEdit);
//포스트 앞에 uploadFiles미들웨어를 써줌으로 해서 input.file인 avartar를 처리함
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);


export default userRouter;