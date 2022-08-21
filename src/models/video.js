// 데이터의 정규화를 위해 생성해주는 것

import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({
        title: { type: String, required: true, trim: true, maxLength: 80 },
        description: { type: String, required: true, trim: true, minLength: 20 },
        createdAt: { type: Date, required: true, default: Date.now },
        hashtags: [{ type: String, trim: true }],
        meta: {
          views: { type: Number, default: 0, required: true },
          rating: { type: Number, default: 0, required: true },
        }
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