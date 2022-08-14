//모듈 내보낼때 꼭 익스포트 써야함(파이썬이랑 다름!)


export const trending = (req, res) => res.render("home", { pageTitle: "Home" }); //퍼그에서 렌더링됨
export const see = (req, res) => res.render('watch', { pageTitle: "Watch" });
export const edit = (req, res) => res.render('edit', { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => {
  return res.send("Delete Video");
};


// 파라미터를 request해와서 전달함
// export const see = (req, res) => {
//   return res.send(`Watch Video #${req.params.id}`);
// };