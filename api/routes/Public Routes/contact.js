import express from "express";
import { tryCatch } from "../../tools/error/tryCatch.js";
import { AppError } from "../../tools/error/AppError.js";
import { transporter } from "../../tools/nodemailer/config.js";
const router = express.Router();

router.post(
  "/",
  tryCatch(async (req, res) => {
    const { name, email, message } = req.body;
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: process.env.NODEMAILER_USER,
      subject: `New Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        new AppError(500, "Unable to send email", 500);
      } else {
        res.send("Email sent successfully");
      }
    });
  })
);

export default router;
