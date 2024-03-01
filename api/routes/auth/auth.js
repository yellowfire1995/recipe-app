import express from "express";
import db from "../../database/db.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const client = await db.connect();
    const query = {
      text: `SELECT * FROM users WHERE username = $1`,
      values: [username],
    };
    db.query(query, null, function (err, row) {
      if (err) {
        return cb(err);
      }
      if (!row) {
        return cb(null, false, { message: "Incorrect username or password." });
      }
      client.release();
      crypto.pbkdf2(
        password,
        row.rows[0].salt,
        310000,
        32,
        "sha256",
        function (err, hashedPassword) {
          if (err) {
            return cb(err);
          }
          if (
            !crypto.timingSafeEqual(row.rows[0].hashed_password, hashedPassword)
          ) {
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }
          return cb(null, row);
        }
      );
    });
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const router = express.Router();

router.get("/login", (req, res, next) => {});

export default router;

router.post(
  "/login/password",
  passport.authenticate("local", {
    failureMessage: true,
  }),
  (req, res) => {
    res.json("test");
  }
);

router.post("/signup", (req, res, next) => {
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    async (err, hashedPassword) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      try {
        console.log(hashedPassword);
        const client = await db.connect();
        const query = {
          text: `INSERT INTO users (username, hashed_password, salt) VALUES ($1, $2, $3)`,
          values: [req.body.username, hashedPassword, salt],
        };
        await db.query(query);
        client.release();
      } catch (error) {
        console.log(error);
      }
    }
  );
});
