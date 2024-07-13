import express from "express";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const S3 = new S3Client({
  credentials: {
    secretAccessKey: secretAccessKey,
    accessKeyId: accessKey,
  },
  region: bucketRegion,
});

// import AWS from "aws-sdk";
// import { fromEnv } from "@aws-sdk/credential-providers";
// import { S3Client } from "@aws-sdk/client-s3";
const router = express.Router();

router.post("/", upload.single("photo"), async (req, res) => {
  try {
    if (req.file) {
      console.log(req.file);
      // const params = {
      //   Bucket: bucketName,
      //   Key: uuidv4(),
      //   Body: req.file.buffer,
      //   ContentType: req.file.mimetype,
      // };
      // const command = new PutObjectCommand(params);
      // await S3.send(command);
    } else if (req.body.photo) {
      const response = await axios.get(req.body.photo, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data, "utf-8");
      const contentType = response.headers["content-type"];
      console.log(buffer);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const getObjectParams = {
      Bucket: bucketName,
      Key: "food.jpg",
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(S3, command, { expiresIn: 3600 });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/", async (req, res) => {
  try {
    const deleteObjectParams = {
      Bucket: bucketName,
      Key: "food.jpg",
    };
    const command = new DeleteObjectCommand(deleteObjectParams);
    await S3.send(command);
  } catch (error) {
    console.log(error);
  }
});

export default router;
