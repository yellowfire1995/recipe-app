import axios from "axios";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

export default async function getPrice(url) {
  puppeteer.use(StealthPlugin());

  const ua =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36";

  const browser = await puppeteer.launch();
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(url, ["geolocation"]);
  const page = await browser.newPage();
  console.log("page launched");
  page.setUserAgent(ua);
  await page.setGeolocation({ latitude: 43.16063, longitude: -85.69073 });
  page.goto(url);
  console.log("page loaded");
  page.setViewport({ width: 1080, height: 1024 });

  if (url.match(/walmart/)) {
    var priceResultSelector = "span.inline-flex.flex-column";
  }
  if (url.match(/meijer/)) {
    var priceResultSelector = "span.product-info__regular-price";
  }
  if (url.match(/samsclub/)) {
    var priceResultSelector = "span.visuallyhidden";
  }
  const price = await page.waitForSelector(priceResultSelector);
  const fullPrice = await price?.evaluate((el) => el.textContent);
  const finalPrice = parseFloat(fullPrice.match(/[0-9.]+/g)[0]);

  // const storeSelector = ".mw-none-m mh2-m truncate";
  // const store = await page.waitForSelector(storeSelector);
  // const name = await store?.evaluation((el) => el.textContent);
  // console.log(name);

  await browser.close();
  return finalPrice;
}
