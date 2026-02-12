import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { extractSchemaRecipe } from "./extractschema.js";
import { extractSamsungHtml } from "./samsungfoodscrape.js";
const proxyAgent = process.env.PROXY_AGENT;

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
    throw new Error("Error! Unable to load website to get recipe.");
  }
}

export async function extractHtml({ url }) {
  try {
    return await extractHtmlNoProxy({ url });
  } catch (error) {
    console.log(`Trying to scrape with proxy...`);
    return await extractHtmlWithProxy({ url });
  }
}

async function extractHtmlNoProxy({ url }) {
  const scrapedHtml = await axios.get(url);
  return scrapedHtml.data;
}

async function extractHtmlWithProxy({ url }) {
  const agent = new HttpsProxyAgent(proxyAgent);
  const scrapedHtml = await axios.get(url, {
    httpAgent: agent,
    httpsAgent: agent,
  });
  return scrapedHtml.data;
}
