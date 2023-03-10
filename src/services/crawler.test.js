const Crawler = require("./crawler");

const SEARCH_STATUS = require("../constants/searchStatus");

const updateSearchResult = jest.fn();
const mockSearchResultService = {
  updateSearchResult,
};

const crawler = new Crawler(mockSearchResultService);

const defaultTimeout = 5 * 60 * 1000;

describe("Crawler Testing", () => {
  it(
    "should scrape keywords successfully",
    async () => {
      const keywords = [
        { id: 1, text: "iphone" },
        { id: 2, text: "mac" },
        { id: 3, text: "buy new car" },
      ];
      await crawler.scrapeKeywords(keywords);

      for (let idx = 0; idx < keywords.length; idx++) {
        const keyword = keywords[idx];
        const params = updateSearchResult.mock.calls[idx][0];

        expect(params.id).toBe(keyword.id);
        expect(params.status).toBe(SEARCH_STATUS.SUCCESS);
        expect(params.totalResults.length).toBeGreaterThan(0);
        expect(params.totalLinks).toBeGreaterThanOrEqual(0);
        expect(params.totalAds).toBeGreaterThanOrEqual(0);
        expect(params.html.length).toBeGreaterThan(0);
      }
    },
    defaultTimeout
  );
});
