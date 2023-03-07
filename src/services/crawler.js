const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const { updateSearchResult } = require("./searchResults");

const randomFromList = require("../utils/randomFromList");
const randFromRange = require("../utils/randFromRange");
const pageActions = require("../utils/pageActions");

const SEARCH_STATUS = require("../constants/searchStatus");
const userAgents = require("../constants/userAgents");

puppeteer.use(StealthPlugin());

const scrapeKeywords = async (keywords) => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  let page = await pageActions.createNewPage(browser);

  for (let idx = 0; idx < keywords.length; idx++) {
    const keyword = keywords[idx];

    const randomUserAgent = randomFromList(userAgents);
    await page.setUserAgent(randomUserAgent);

    let data, html;
    try {
      if (idx === 0) await pageActions.searchAtMainPage(page, keyword.text);
      else await pageActions.searchAtResultPage(page, keyword.text);

      data = await pageActions.getSearchResultInfo(page);
      html = await page.content();
    } catch (error) {
      console.log(error);

      page = await pageActions.createNewPage(browser);
      await pageActions.searchAtMainPage(page, keyword.text);

      idx--;
      continue;
    }

    const searchResult = {
      id: keyword.id,
      status: SEARCH_STATUS.SUCCESS,
      totalResults: data.totalResults,
      totalLinks: data.totalLinks,
      totalAds: data.totalAds,
      html,
    };

    await updateSearchResult(searchResult);

    await page.waitForTimeout(randFromRange(3, 5) * 1000);
  }

  await browser.close();
};

module.exports = {
  scrapeKeywords,
};
