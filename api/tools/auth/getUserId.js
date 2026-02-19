import axios from "axios";
import { AppError } from "../error/AppError.js";

export async function getUserId(req, res, next) {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: process.env.AUTH0_VERIFY,
    headers: {
      Accept: "application/json",
      Authorization: `${req.headers.authorization}`,
      scope: "openid profile email",
    },
  };

  const activeUser = await axios.request(config);

  if (activeUser.data.sub) {
    req.user = activeUser.data;
    next();
  } else {
    throw new AppError(401, "Unauthorized", 401);
  }
}
