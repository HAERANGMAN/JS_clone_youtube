//아래 두개는 같은것을 의미함
import express from "express";
// const express = require("express");

const PORT = 4000;

const app = express();

/////////////////////////////// request, response개념 ////////////////////////////////
// 브라우저가 get request하면("/"url이오면) 함수를 실행
const handleHome = () => console.log("Somebody is trying to go home.");

app.get("/", handleHome);

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
