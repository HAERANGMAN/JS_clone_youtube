//아래 두개는 같은것을 의미함
import express from "express";
// const express = require("express");

const PORT = 4000;

const app = express();

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
