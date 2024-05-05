import express from "express";
import axios from "axios";
import "dotenv/config";
import getManagementToken from "./managementToken.js";
const _ = process.env;
const router = express.Router();
import db from "../../database/db.js";
import { getUserId } from "../../tools/getUserId.js";

// const refreshToken = await getManagementToken();
// console.log(refreshToken.access_token);

router.patch("/", getUserId, async (req, res) => {
  // console.log(req.body);
  // const token = refreshToken.access_token;
  // const token = _.AUTH0_DEV_MGT_TOKEN;

  try {
    const updateAuth0 = await axios.patch(
      `${_.AUTH0_AUDIENCE}users/${req.user.sub}`,
      { nickname: req.body.nickname },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const query = {
      text: ` UPDATE recipes
        SET nickname = $1
        WHERE author = $2   `,
      values: [req.body.nickname, req.user.sub],
    };
    const updateDb = await db.query(query);
    res.send(updateAuth0.data);
  } catch (error) {
    console.error(error);
  }
});

export default router;
