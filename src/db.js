import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/youtube_clone");
// {   오류가 날경우 connect("주소", {요기})에 넣자
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//         useCreateIndex: true,
// }

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);