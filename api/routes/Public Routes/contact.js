import express from "express";
import { AppError } from "../../tools/error/AppError.js";
import { tryCatch } from "../../tools/error/tryCatch.js";
import { transporter } from "../../tools/nodemailer/config.js";
const router = express.Router();

router.post(
  "/",
  tryCatch(async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      console.log("Contact form submitted without all information.");
      new AppError(400, "Missing information", 400);
    }
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: process.env.NODEMAILER_USER,
      subject: `New Form Submission from ${name}`,
      text: `Name: ${name}\n Email: ${email}\n Message: ${message}`,
    };
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        new AppError(500, "Unable to send email", 500);
      } else {
        res.send("Email sent successfully");
      }
    });
  }),
);

export default router;
