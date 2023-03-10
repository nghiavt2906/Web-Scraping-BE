const userAgents = require("../constants/userAgents");
const randomFromList = require("./randomFromList");

const createNewPage = async (browser) => {
  const page = await browser.newPage();
  (await browser.pages())[0].close();

  const randomUserAgent = randomFromList(userAgents);

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

const goToGoogle = async (page) => {
  await page.goto("https://google.com/?hl=en");
  await page.waitForTimeout(3 * 1000);
};

const searchAtMainPage = async (page, text) => {
  try {
    await page.type("input[type='text']", text);
  } catch (error) {
    await page.type("input[class='gLFyf']", text);
  }
  await page.waitForTimeout(2 * 1000);
  await page.click("input[class='gNO89b']"); // click search btn
  await page.waitForNavigation({ waitUntil: "networkidle2" });
};

const searchAtResultPage = async (page, text) => {
  await page.evaluate(() => {
    document.querySelector("input[type='text']").value = "";
  });
  await page.type("input[type='text']", text);
  await page.click("div[class='zgAlFc']"); // click search btn
  await page.waitForNavigation({ waitUntil: "networkidle2" });
};

const getSearchResultInfo = async (page) => {
  return page.evaluate(() => {
    const resultStats = document.getElementById("result-stats");
    const totalResults = resultStats
      ? resultStats.innerText.trim()
      : "Not found";
    const totalLinks = document.querySelectorAll("a").length;
    const totalAds =
      document.querySelectorAll(".uEierd").length +
      document.querySelectorAll(".twpSFc.mnr-c").length +
      Array.from(document.querySelectorAll(".mnr-c.pla-unit")).filter(
        (item) => item.className === "mnr-c pla-unit"
      ).length;

    return {
      totalResults,
      totalLinks,
      totalAds,
    };
  });
};

module.exports = {
  goToGoogle,
  createNewPage,
  searchAtMainPage,
  searchAtResultPage,
  getSearchResultInfo,
};
