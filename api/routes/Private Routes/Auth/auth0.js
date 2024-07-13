import express from "express";
import axios from "axios";
import "dotenv/config";
import getManagementToken from "../../../tools/auth/managementToken.js";
const _ = process.env;
const router = express.Router();
import db from "../../../database/db.js";

let refreshToken = {};

if (_.ENV == "production") {
  refreshToken = await getManagementToken();
}

router.patch("/", async (req, res) => {
  const token = _.AUTH0_DEV_MGT_TOKEN;

  if (_.ENV == "production") {
    try {
      token = refreshToken.access_token;
    } catch (error) {
      console.log("Error obtaining auth0 access token.");
    }
  }

  try {
    const updateAuth0 = await axios.patch(
      `${_.AUTH0_AUDIENCE}users/${req.auth.payload.sub}`,
      { nickname: req.body.nickname },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const query = {
      text: ` UPDATE recipes
        SET nickname = $1
        WHERE author = $2   `,
      values: [req.body.nickname, req.payload.auth.sub],
    };
    const updateDb = await db.query(query);
    res.send(updateAuth0.data);
  } catch (error) {
    console.error(error);
  }
});

export default router;
