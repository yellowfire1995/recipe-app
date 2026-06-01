import axios from "axios";
import imageType from "image-type";
import ssrfFilter from "ssrf-req-filter";

export async function downloadImage(url) {
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Protocol not allowed");
  }

  const { data } = await axios({
    url,
    responseType: "arraybuffer",
    timeout: 5000,
    maxContentLength: 10 * 1024 * 1024,
    maxRedirects: 3,
    httpsAgent: ssrfFilter(url),
    httpAgent: ssrfFilter(url),
  });

  const buffer = Buffer.from(data);
  const type = await imageType(buffer);

  if (!type) throw new Error("Not a valid image");

  return { buffer, mimetype: type.mime };
}
