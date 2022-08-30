import multer from "multer";


export const localsMiddleware = (req, res, next) =>{
        //여기서 locals에 정보를 주고 이정보는 pug로 감
        res.locals.loggedIn = Boolean(req.session.loggedIn);
        res.locals.siteName = "Youtube_Clone";
        res.locals.loggedInUser = req.session.user || {};//||는 or을 의미함 없으면 {}라는 뜻
        next();
}

//로그인이 필요한 영역만
export const protectorMiddleware = (req, res, next) => {
        if (req.session.loggedIn) {
                return next();
        } else {
                return res.redirect("/login");
        }
};

//로그인이 되어있으면 안되는 영역만(회원가입등)
export const publicOnlyMiddleware = (req, res, next) => {
        if (!req.session.loggedIn) {
                return next();
        } else {
                return res.redirect("/");
        }
};

//dest는 서버에 저장하는 경로, limits는 파일사이즈
export const avatarUpload = multer({
        dest: "uploads/avatars/",
        limits: {
          fileSize: 10000000,
        },
});

export const videoUpload = multer({
dest: "uploads/videos/",
limits: {
        fileSize: 20000000,
},
});