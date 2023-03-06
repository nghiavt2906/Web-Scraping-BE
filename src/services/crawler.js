const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const { updateSearchResult } = require("./searchResults");
const SEARCH_STATUS = require("../constants/searchStatus");

puppeteer.use(StealthPlugin());

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.56",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.50",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
];

const generateNewPage = async (browser) => {
  const page = await browser.newPage();
  (await browser.pages())[0].close();

  const randomUserAgent =
    userAgents[Math.floor(Math.random() * userAgents.length)];

  await page.setExtraHTTPHeaders({
    "user-agent": randomUserAgent,
    "upgrade-insecure-requests": "1",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
  });
  await page.setDefaultNavigationTimeout(0);
  await page.setRequestInterception(true);
  page.on("request", async (request) => {
    if (request.resourceType() == "image") {
      await request.abort();
    } else {
      await request.continue();
    }
  });

  return page;
};

const scrapeKeywords = async (keywords) => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  let page = await generateNewPage(browser);

  await page.goto("https://google.com/?hl=en");
  await page.waitForTimeout(3 * 1000);
  await page.type("input[type='text']", "test");
  await page.waitForTimeout(2 * 1000);

  await page.click("input[class='gNO89b']");
  await page.waitForTimeout(5 * 1000);

  for (let idx = 0; idx < keywords.length; idx++) {
    const keyword = keywords[idx];
    const randomUserAgent =
      userAgents[Math.floor(Math.random() * userAgents.length)];

    await page.setUserAgent(randomUserAgent);

    try {
      await page.evaluate(() => {
        document.querySelector("input[type='text']").value = "";
      });
    } catch (error) {
      break;
    }
    await page.type("input[type='text']", keyword.text);

    try {
      await page.click("div[class='zgAlFc']"); // click search btn
    } catch (error) {
      console.log(error);
      page = await generateNewPage(browser);

      await page.goto("https://google.com/?hl=en");
      await page.waitForTimeout(3 * 1000);
      await page.type("input[type='text']", "test");
      await page.waitForTimeout(2 * 1000);
      await page.click("input[class='gNO89b']");
      await page.waitForTimeout(5 * 1000);

      idx--;
      continue;
    }

    await page.waitForTimeout(3 * 1000);
    // await page.waitForNavigation();

    const data = await page.evaluate(() => {
      const resultStats = document.getElementById("result-stats");
      const totalResults = resultStats
        ? resultStats.innerText.trim()
        : "Not found";
      const totalLinks = document.querySelectorAll("a").length;
      const totalAds =
        document.querySelectorAll(".uEierd").length +
        Array.from(document.querySelectorAll(".mnr-c.pla-unit")).filter(
          (item) => item.className === "mnr-c pla-unit"
        ).length;

      return {
        totalResults,
        totalLinks,
        totalAds,
      };
    });

    const html = await page.content();

    const searchResult = {
      id: keyword.id,
      status: SEARCH_STATUS.SUCCESS,
      totalResults: data.totalResults,
      totalLinks: data.totalLinks,
      totalAds: data.totalAds,
      html,
    };
    await updateSearchResult(searchResult);

    await page.waitForTimeout((Math.random() * (3 - 1) + 1) * 1000);
  }

  await browser.close();
};

module.exports = {
  scrapeKeywords,
};
