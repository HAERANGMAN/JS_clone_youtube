//모듈 내보낼때 꼭 익스포트 써야함(파이썬이랑 다름!)


export const trending = (req, res) => res.send("Home Page Videos");
// 파라미터를 request해와서 전달함
export const see = (req, res) => {
  return res.send(`Watch Video #${req.params.id}`);
};
export const edit = (req, res) => {
  return res.send("Edit");
};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => {
  return res.send("Delete Video");
};