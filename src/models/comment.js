// // comment.js(파일명)과 export.Comment(dbname)을 구분하기위해서 대소문자 구분함

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  createdAt: { type: Date, required: true, default: Date.now },
});

const modelComment = mongoose.model("Comment", commentSchema);

export default modelComment;