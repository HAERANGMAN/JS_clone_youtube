//모듈 내보낼때 꼭 익스포트 써야함(파이썬이랑 다름!)

// const fakeUser = {
//   username: "Nicolas",
//   loggedIn: false,
// };

// export const trending = (req, res) => res.render("home", { pageTitle: "Home", fakeUser }); 

// fake db <= mongoose 이후 model의 정규데이터에 따라서 데이터 구성함
// let videos = [
//   {
//     title: "First Video",
//     rating: 5,
//     comments: 2,
//     ...
//   },
// ...원래는 3까지 있었음
// ];

import modelVideo from "../models/video";
import modelUser from "../models/user";

///////////////////////////////////////////////////////////////
// callback 방식
// console.log("start")
// Video.find({}, (error, videos) => {
//   return res.render("home", { pageTitle: "Home", videos });
// });
// console.log("finished")
////////////////////////////////////////////////////////////////

export const home = async (req, res) => {  
  const potato = await modelVideo.find({}).sort({ createdAt: "desc" }).populate("owner");
  const videos = potato;
  return res.render("home", {pageTitle: "Home", videos});
}; //퍼그(pageTitle)에서 렌더링됨

  //callback방식 modelVideo.find({}, (error, potato) =>{
    // const videos = potato //위에서 임의의 변수 potato를 받아오지만 퍼그로 보내주는 변수명은 일치해야 오류가 나지않음

export const watch = async (req, res) => {
  const { id } = req.params; //url에서 오는것임 //ES6문법
  // const video = videos[id - 1]; //인덱스=id-1
  // const video = await modelVideo.findById(id);
  // const owner = await modelUser.findById(video.owner); //비디오에서 찾은 owner값(ID)를 modelUser에서 찾는 과정임 그것을 render로 보내줌
  const video = await modelVideo.findById(id).populate("owner");
  // populate를 통해서 modelVideo.owner에 {"User"데이터}를 역참조해줌 
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video});
};


export const getEdit = async (req, res) => {
  const { id } = req.params; //url에서 오는것임
  const {
    user: { _id },
  } = req.session;
  // const video = videos[id - 1];
  const video = await modelVideo.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  } //비디오 소유자와 session _id가 다르면 접근 불가능
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video }); 
  //{ pageTitle: `Editing: ${video.title}!`, video }
};


export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params; //url에서 오는것임
  const { title, description, hashtags } = req.body; //얻어오기
  // videos[id - 1].title = title; //기존값수정
  // const video = await modelVideo.findById(id);
  const video = await modelVideo.findById(id);
  // exists({ 원하는property : value})로 검색가능, id는 id만
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  } //비디오 소유자와 session _id가 다르면 접근 불가능
  // video.title = title;
  // video.description = description;
  // video.hashtags = hashtags
  //   .split(",")
  //   .map((word) => (word.startsWith("#") ? word : `#${word}`)); // #으로 시작하면 전자 아니면 후자
  // await video.save();
  await modelVideo.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: modelVideo.formatHashtags(hashtags)
    // hashtags,: hashtags
    //   .split(",")
    //   .map((word) => (word.startsWith("#") ? word : `#${word}`)),
    //이렇게 노가다하면 별로라서 model의 middle웨어로 분리해줌
  },
  { new: true }); //업데이트된 내용을 return해주는 방식
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `Upload!`});
}

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await modelVideo.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      hashtags: modelVideo.formatHashtags(hashtags),
    });
    const user = await modelUser.findById(_id);
    user.videos.push(newVideo._id); //user.videos = 비디오리스트에 append
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message, //퍼그에 errorMessage를 던져줌
    });
  }
  /////////////////////////////////////////////////////////////////////////
  // 모델을 만들어서 save하는 방법
  // const newVideo = new modelVideo({
  //   title, //title: title와 동일
  //   description: description,
  //   createdAt: Date.now(),
  //   hashtags: hashtags.split(",").map((word) => `#${word}`), //쪼개서 #삽입
  //   meta: {
  //     views: 0, //만약여기를 str로 보내면 내용이전송되지않음.. 유효성검증됨
  //     rating: 0,
  //   },
  // });
  // await newVideo.save(); //전송되는데 시간이걸려서 await로 기다림
  // return res.redirect('/');
  /////////////////////////////////////////////////////////////////////////
  // fakeDB를 사용하여 push추가하는 방법
  // const newVideo = {
  //   title,
  //   rating: 0,
  //   comments: 0,
  //   createdAt: "just now",
  //   views: 0,
  //   id: videos.length + 1, //len만큼추가
  // };
  // videos.push(newVideo); //append대신에 push를 사용함
  // return res.redirect('/');
}

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await modelVideo.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await modelVideo.findByIdAndDelete(id);
  const del_video = await modelUser.findById(id)                          
  del_video.videos.splice(del_video.videos.indexOf(id), 1); //위치찾아서 삭제
  return res.redirect("/");
};


export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await modelVideo.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};


// 파라미터를 request해와서 전달함
// export const see = (req, res) => {
//   return res.send(`Watch Video #${req.params.id}`);
// };


export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await modelVideo.findById(id);
  if (!video) {
    return res.sendStatus(404);
    // return res.status(404); 이건 .render()를 추가해야됨
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
  // return res.status(200); 한마디로 return이 없는상태라 오류..
};


export const createComment = (req, res) => {
  console.log(req.params);
  console.log(req.body);
  console.log(req.body.text, req.body.rating); //넘어온 json.key
  return res.end();
};




