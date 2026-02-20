import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import axios from "axios";
import { useAgent } from "request-filtering-agent";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const bucketName = process.env.BUCKET_NAME;
const bucketEndpoint = process.env.BUCKET_ENDPOINT;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const S3 = new S3Client({
  credentials: {
    secretAccessKey: secretAccessKey,
    accessKeyId: accessKey,
  },
  region: bucketRegion,
  endpoint: bucketEndpoint,
});

export async function resizeAndUploadFileToS3(file) {
  const key = uuidv4();
  const buffer = await sharp(file.buffer).webp().resize(250).toBuffer();
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await S3.send(command);
  return key;
}

export async function uploadFileToS3(file) {
  const key = uuidv4();
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: await sharp(file.buffer).webp().toBuffer(),
    ContentType: file.mimetype,
  };
  const command = new PutObjectCommand(params);
  await S3.send(command);
  return key;
}

export async function uploadDualSizesUrlToS3(url) {
  const key = uuidv4();
  const thumbnailKey = uuidv4();
  const response = await axios.get(url, {
    agent: useAgent(url),
    responseType: "arraybuffer",
  });
  const contentType = response.headers["content-type"];

  const buffer = Buffer.from(response.data, "utf-8");

  const fullImageBuffer = await sharp(buffer).webp().toBuffer();

  const imageVerification = await sharp(fullImageBuffer).metadata();
  if (!imageVerification.format) {
    throw new Error("Invalid Image format");
  }

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fullImageBuffer,
    ContentType: contentType,
  };

  let command = new PutObjectCommand(params);
  await S3.send(command);

  const thumbnailBuffer = await sharp(buffer).webp().resize(500).toBuffer();

  const thumbnailParams = {
    Bucket: bucketName,
    Key: thumbnailKey,
    Body: thumbnailBuffer,
    ContentType: contentType,
  };

  command = new PutObjectCommand(thumbnailParams);
  await S3.send(command);
  return { key: key, thumbnailKey: thumbnailKey };
}

export async function uploadUrlToS3(link) {
  try {
    const key = uuidv4();
    const response = await axios.get(link, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data, "utf-8");

    const imageVerification = await sharp(buffer).metadata();
    if (!imageVerification.format) {
      throw new Error("Invalid Image format");
    }

    const contentType = response.headers["content-type"];
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: await sharp(buffer).webp().toBuffer(),
      ContentType: contentType,
    };
    const command = new PutObjectCommand(params);
    await S3.send(command);
    return key;
  } catch (error) {
    console.log(error);
    Promise.reject();
  }
}

export async function deleteFromS3(key) {
  try {
    const deleteObjectParams = {
      Bucket: bucketName,
      Key: key,
    };
    const command = new DeleteObjectCommand(deleteObjectParams);
    await S3.send(command);
  } catch (error) {
    console.log(error);
  }
}
