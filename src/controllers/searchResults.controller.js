const searchResultsService = require("../services/searchResults");

const getSearchResultInformation = async (req, res) => {
  const { id } = req.params;
  try {
    const searchResult = await searchResultsService.getSearchResultById(
      id,
      req.user.id
    );
    return res.json(searchResult);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send("Something went wrong");
  }
};

module.exports = {
  getSearchResultInformation,
};
