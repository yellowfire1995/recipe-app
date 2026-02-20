import axios from "axios";
import { useAgent } from "request-filtering-agent";
import { extractSchemaRecipe } from "./extractschema.js";
import { extractSamsungHtml } from "./samsungfoodscrape.js";

const proxyAgent = process.env.PROXY_AGENT;

function validateRecipeUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Invalid URL.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP/HTTPS URLs are permitted.");
  }

  const blocked =
    /^(localhost|127\.|0\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.)/;
  if (blocked.test(parsed.hostname)) {
    throw new Error("Internal URLs are not permitted.");
  }

  return parsed.href;
}

export default async function getRecipe({ url, html }) {
  try {
    if (url && url.match(/(samsungfood)/)) {
      return await extractSamsungHtml({ url });
    } else if (url) {
      const scrapedHtml = await extractHtml({ url });
      return await extractSchemaRecipe({ html: scrapedHtml });
    } else if (html) {
      return await extractSchemaRecipe({ html });
    }
  } catch (error) {
    console.log(`Error getting recipe:` + error);
    throw new Error("Error! Unable to load website to get recipe.", {
      cause: error,
    });
  }
}

export async function extractHtml({ url }) {
  try {
    return await extractHtmlNoProxy({ url });
  } catch {
    console.log(`Trying to scrape with proxy...`);
    return await extractHtmlWithProxy({ url });
  }
}

async function extractHtmlNoProxy({ url }) {
  const safeUrl = validateRecipeUrl(url);
  const scrapedHtml = await axios.get(safeUrl, {
    httpAgent: proxyAgent,
    httpsAgent: proxyAgent,
  });
  return scrapedHtml.data;
}

async function extractHtmlWithProxy({ url }) {
  const scrapedHtml = await axios.get(url, { agent: useAgent(url) });
  return scrapedHtml.data;
}
