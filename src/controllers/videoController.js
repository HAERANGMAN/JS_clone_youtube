//모듈 내보낼때 꼭 익스포트 써야함(파이썬이랑 다름!)

// const fakeUser = {
//   username: "Nicolas",
//   loggedIn: false,
// };

// export const trending = (req, res) => res.render("home", { pageTitle: "Home", fakeUser }); 

let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 3,
  },
];

export const trending = (req, res) => {  
  return res.render("home", { pageTitle: "Home", videos });}; //퍼그에서 렌더링됨
export const watch = (req, res) => {
  const { id } = req.params; //ES6문법
  const video = videos[id - 1]; //인덱스=id-1
  return res.render("watch", { pageTitle: `Watching: ${video.title}!`, video});
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}!`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body; //얻어오기
  videos[id - 1].title = title; //기존값수정
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `Upload!`});
}
export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 0,
    comments: 0,
    createdAt: "just now",
    views: 0,
    id: videos.length + 1, //len만큼추가
  };
  videos.push(newVideo); //append대신에 push를 사용함
  return res.redirect('/');
}

export const search = (req, res) => res.send("Search");

export const deleteVideo = (req, res) => {
  return res.send("Delete Video");
};


// 파라미터를 request해와서 전달함
// export const see = (req, res) => {
//   return res.send(`Watch Video #${req.params.id}`);
// };