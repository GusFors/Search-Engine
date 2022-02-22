const searchController = {}
const wordFreq = require('../data-utils/searcher')

searchController.getSearch = async (req, res, next) => {
  let includeLocation = req.query.location.toLowerCase() === 'true'

  const t0 = performance.now()
  let wordQuery = wordFreq.query(req.query.search, includeLocation)
  const t1 = performance.now()

  res.status(200).json({
    message: `Search results for query: ${req.query.search}`,
    results: wordQuery.topResults,
    time: t1 - t0,
    numResults: wordQuery.numResults,
  })
}

module.exports = searchController
