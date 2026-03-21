export async function getUserId(req, res, next) {
  req.user = {
    sub: req.auth.payload.sub,
    nickname: req.auth.payload.nickname,
  };
  next();
}
