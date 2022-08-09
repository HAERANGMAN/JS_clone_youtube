//아래 두개는 같은것을 의미함
import express from "express";
// const express = require("express");

const app = express();



/////////////////////// request, response개념(~3.3강) //////////////////////////
// 브라우저가 get request하면("/", 해당 url이오면) 함수를 실행

const handleHome = (request, response) => {
//     const btn = document.createElement("button");
//     btn.innerText = "login here!";
//     btn.style = "margin: 0px 10px 3px 0px";
//     document.querySelector('body').appendChild(btn);
    // return response.end(); //end()로 반응없이 끄기
    return response.send("<h1>안녕하세용!</h1>")
};

const handleLogin = (potato, tomato) => {
    return tomato.send({ messege:"Login here."}); // json으로 전송
};


app.get("/", handleHome);
app.get("/login", handleLogin);


/////////////////////////////// 서버오픈(~3.1강)////////////////////////////////
const PORT = 4000;
const handleListening = () => console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
