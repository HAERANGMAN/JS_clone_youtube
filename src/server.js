import morgan from "morgan";
import express from "express";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";



/////////////////////////////////////////////////////////////////////////////////
/// variable ////////////////////////////////////////////////////////////////////

const app = express();
const logger = morgan("dev");



/////////////////////////////////////////////////////////////////////////////////
/// app.get(routes, controllers) ////////////////////////////////////////////////

app.set("view engine", "pug"); //pug추가
app.set("views", process.cwd() + "/src/views"); //pug의 상대경로 재입력
app.use(logger);
app.use(express.urlencoded({ extended: true })); //body를 가져오는기위해 미들웨어로 사용

// 세션,쿠키
app.use(
        session({
          secret: "Hello!",
          resave: true,
          saveUninitialized: true,
        })
      );
      
      app.use((req, res, next) => {
        req.sessionStore.all((error, sessions) => {
          console.log(sessions);
          next();
        });
      });

// 미들웨어는 router까지
//////////////////////////////////////////////////////////////////////
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);


export default app;
