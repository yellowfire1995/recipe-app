import express from "express";
import axios from "axios";
import "dotenv/config";
import getManagementToken from "../../../tools/auth/managementToken.js";
const _ = process.env;
const router = express.Router();
import db from "../../../database/db.js";

let refreshToken;

if (_.ENV === "production") {
  refreshToken = await getManagementToken();
  console.log("token loaded");
}

router.patch("/", async (req, res) => {
  try {
    const updateAuth0 = await axios.patch(
      `${_.AUTH0_AUDIENCE}users/${req.auth.payload.sub}`,
      { nickname: req.body.nickname },
      {
        headers: {
          Authorization: `Bearer ${
            refreshToken?.access_token || _.AUTH0_DEV_MGT_TOKEN
          }`,
        },
      }
    );
    const query = {
      text: ` UPDATE recipes
        SET nickname = $1
        WHERE author = $2   `,
      values: [req.body.nickname, req.auth.payload.sub],
    };
    await db.query(query);
    res.send(updateAuth0.data);
  } catch (error) {
    console.error(error);
  }
});

export default router;
