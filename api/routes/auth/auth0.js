import express from "express";
import axios from "axios";
import "dotenv/config";
import getManagementToken from "./managementToken.js";
const _ = process.env;
const router = express.Router();
import db from "../../database/db.js";

// const refreshToken = await getManagementToken();

router.patch("/", async (req, res) => {
  // const token = refreshToken
  const token = _.AUTH0_DEV_MGT_TOKEN;

  try {
    const updateAuth0 = axios.patch(
      `${_.AUTH0_AUDIENCE}users/${req.body.user_id}`,
      { nickname: req.body.nickname },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const query = {
      text: ` UPDATE recipes
      SET nickname = $1
      WHERE author = $2   `,
      values: [req.body.nickname, req.body.user_id],
    };
    const updateDb = await db.query(query);

    res.send([updateAuth0.data, updateDb.data]);
  } catch (error) {
    console.error(error);
  }

  console.log(req.body.nickname);
});

export default router;
