import axios from "axios";
import { auth } from "express-oauth2-jwt-bearer";

export const checkJwt = auth({
  audience: [process.env.AUTH0_AUDIENCE, process.env.AUTH0_VERIFY],
  issuerBaseURL: process.env.AUTH0_BASEURL,
});

export async function getUserId(req, res, next) {
  console.log(req.headers);
  try {
    let config = {
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
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    res.status(401).send("ERROR");
  }
}
