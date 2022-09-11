// video.js(파일명)과 export.Video(dbname)을 구분하기위해서 대소문자 구분함

// 데이터의 정규화를 위해 생성해주는 것

import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({
        title: { type: String, required: true, trim: true, maxLength: 80 },
        fileUrl: { type: String, required: true },
        thumbUrl: { type: String, required: true },
        description: { type: String, required: true, trim: true, minLength: 2 },
        createdAt: { type: Date, required: true, default: Date.now },
        hashtags: [{ type: String, trim: true }],
        meta: {
          views: { type: Number, default: 0, required: true },
        },
        comments: [
          { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
        ],
        owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, //ref: "User"에서 ObjectId를 가져옴
      });
            

//해시태그처리 방법1(middleware로 처리)
// videoSchema.pre("save", async function () {
//   this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((word) => (word.startsWith("#") ? word : `#${word}`));
// });

//해시태그처리 방법2(변수로 처리)
// export const formatHashtags = (potato) => potato.split(",").map((tomato)=>(tomato.startsWith("#") ? word : `#${word}`))


//해시태그처리 방법3(Static Way)
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const modelVideo = mongoose.model("Video", videoSchema); //(dbname, 형식)

export default modelVideo;