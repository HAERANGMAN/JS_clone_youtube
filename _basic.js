import morgan from "morgan";
import express from "express";
// const express = require("express");
// 위에 두개는 같은것을 의미함

const app = express();
const logger = morgan("dev");

/////////////////////// request, response개념(~3.3강) //////////////////////////
// 브라우저가 get request하면("/", 해당 url이오면) 함수를 실행

const handleHome = (request, response) => {
  //     const btn = document.createElement("button");
  //     btn.innerText = "login here!";
  //     btn.style = "margin: 0px 10px 3px 0px";
  //     document.querySelector('body').appendChild(btn);
  // return response.end(); //end()로 반응없이 끄기
  return response.send("<h1>안녕하세용!</h1>");
};

const handleLogin = (potato, tomato) => {
  return tomato.send({ messege: "Login here." }); // json으로 전송
};

// 미들웨어는 next()를 써줘야 다음 함수로 넘어감(여기서는 handleHome)
const gossipMiddleware = (req, res, next) => {
  console.log(`Someone is going to: ${req.url}`);
  // return res.send("over here!"); //return의 경우에는 노미들웨어임(handleHome실행안됨)
  next();
};

const my_logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>NOT ALLOWED</h1>");
  }
  console.log("allowed, you can continue");
  next();
};

//use는 글로벌 미들웨어임, get에 선행함
app.use(logger);
app.use(my_logger);
app.use(privateMiddleware);
app.get("/", gossipMiddleware, handleHome); //미들웨어(gossipMiddleware) 추가됨
app.get("/login", handleLogin);

/////////////////////////////// 서버오픈(~3.1강)////////////////////////////////
const PORT = 4000;
const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
