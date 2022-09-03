import morgan from "morgan";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";



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
app.use(session({
          secret: process.env.DB_URL,
          resave: false, //true일경우 일반접속자까지 쿠키저장
          saveUninitialized: false, //true일경우 일반접속자까지 쿠키저장
          store: MongoStore.create({ mongoUrl: process.env.COOKIE_SECRET }),
        })
);
      
//로그인한 모든사람들을 보여줌
// app.use((req, res, next) => {
// req.sessionStore.all((error, sessions) => {
//         console.log(sessions);
//         next();});
// });

//id는 재방문해도 고정이지만 f5할때마다 potato는 증가함
// app.get("/add-one", (req, res, next) => {
//         req.session.potato += 1; 
//         return res.send(`${req.session.id} ${req.session.potato}`);
// });

app.use(localsMiddleware) //위에서 썼던 세션관련한것을 여기서 활용
// 미들웨어는 router전까지써야함
//////////////////////////////////////////////////////////////////////
app.use("/uploads", express.static("uploads"))
//(사진)만약 누군가가 /uploads로 접근한다면 uploads 라는 폴더를 보여주라고 함
app.use("/static", express.static("assets")) //assets 공개 (url, 폴더명 순)
//웹경로는 static/AAAA/BBBB 이겠지만 실제 파일경로는 assets/AAAA/BBBB
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);


export default app;
