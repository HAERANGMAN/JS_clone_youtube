export const localsMiddleware = (req, res, next) =>{
        //여기서 locals에 정보를 주고 이정보는 pug로 감
        res.locals.loggedIn = Boolean(req.session.loggedIn);
        res.locals.siteName = "Youtube_Clone";
        res.locals.loggedInUser = req.session.user;
        next();
}