import axios from "axios";

export async function getUserId(req, res, next) {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://dev-8oxkv6xzy7mdml3z.us.auth0.com/userinfo/`,
      headers: {
        Accept: "application/json",
        Authorization: `${req.headers.authorization}`,
      },
    };

    const activeUser = await axios.request(config);

    if (activeUser.data.sub) {
      req.user = activeUser.data.sub;
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error(error);
    res.status;
  }
}
