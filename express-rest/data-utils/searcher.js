const dataReader = require('./dataReader')

const searcher = {
  pageObjects: [],
  scanned: false,
  readFiles: [],
}

// KOLLA PÅ FOR OF LOOPAR ISTÄLLET FÖR VANLIGA FOR TILL NÄSTA GÅNG
searcher.query = (searchQuery, includeLocation) => {
  if (!searcher.scanned) {
    searcher.scanned = true
    searcher.scanAndAddPageWords()
  }

  let pages = []
  let queries = searchQuery.toLowerCase().split(' ')

  // calc word frequency metrics
  for (let j = 0; j < searcher.pageObjects.length; j++) {
    // each page
    let totalScore = 0
    let isResult = false

    for (let i = 0; i < queries.length; i++) {
      // check if page contains current query
      if (searcher.pageObjects[j].words[queries[i]]) {
        isResult = true
        totalScore += searcher.pageObjects[j].words[queries[i]]
      }
    }

    if (isResult) {
      pages.push({ url: searcher.pageObjects[j].url, score: totalScore })
    }
  }
  pages.sort((a, b) => {
    return b.score - a.score
  })

  if (pages.length > 0) {
    // normalize word frequency scores
    searcher.normalize(pages, false)
  }

  let locationMeasures
  const locationWeight = 0.8

  // recalculate scores with the document location metric
  if (includeLocation) {
    locationMeasures = searcher.documentLocation(queries)

    for (let i = 0; i < pages.length; i++) {
      for (let j = 0; j < locationMeasures.length; j++) {
        if (pages[i].url === locationMeasures[j].url) {
          pages[i].content = pages[i].score
          pages[i].score = pages[i].score + locationWeight * locationMeasures[j].score
          pages[i].location = locationWeight * locationMeasures[j].score
        }
      }
    }
    // sort the new top scores
    pages.sort((a, b) => {
      return b.score - a.score
    })
  }

  let finalScoreResults = []

  // return top 5 search results
  for (let i = 0; i < 5; i++) {
    if (pages[i]) {
      finalScoreResults.push({ ...pages[i] })
    }
  }

  return { topResults: finalScoreResults, numResults: pages.length }
}

// normalize scores depending on metric
searcher.normalize = (scores, smallIsBetter) => {
  if (smallIsBetter) {
    let minvalue = scores[0].score

    for (let i = 0; i < scores.length; i++) {
      scores[i].score = minvalue / Math.max(scores[i].score, 0.00001)
    }
  } else {
    let maxValue = scores[0].score

    for (let i = 0; i < scores.length; i++) {
      scores[i].score = scores[i].score / maxValue
    }
  }
}

// calculates the document location metric for the queries
searcher.documentLocation = (queries) => {
  let locationPages = []

  for (let y = 0; y < searcher.readFiles.length; y++) {
    let indexScore = 0
    for (let i = 0; i < queries.length; i++) {
      let separatedWords = searcher.readFiles[y].words
      let wordWasFound = false

      for (let j = 0; j < separatedWords.length; j++) {
        if (separatedWords[j] === queries[i]) {
          indexScore += j + 1
          wordWasFound = true
          break
        }
      }
      if (!wordWasFound) {
        indexScore += 100000
      }
    }
    locationPages.push({ url: 'https://wikipedia.org/wiki/' + searcher.readFiles[y].url, score: indexScore })
  }

  locationPages.sort((a, b) => {
    return a.score - b.score
  })

  searcher.normalize(locationPages, true)

  return locationPages
}

// store pages and words in memory
searcher.addPageFilesWords = (dirFilesArr, dirString) => {
  for (let i = 0; i < dirFilesArr.length; i++) {
    const currentFileNameInDir = dirFilesArr[i]

    let fileWordString = dataReader.getFile(dirString + currentFileNameInDir)
    let separatedWords = fileWordString.split(' ')
    let wordCountObj = {}

    for (let j = 0; j < separatedWords.length; j++) {
      if (wordCountObj[separatedWords[j]] === undefined) {
        wordCountObj[separatedWords[j]] = 1
      } else {
        wordCountObj[separatedWords[j]] += 1
      }
    }

    searcher.pageObjects.push({ url: 'https://wikipedia.org/wiki/' + currentFileNameInDir, words: wordCountObj })
    searcher.readFiles.push({ url: currentFileNameInDir, words: separatedWords })
  }
}

searcher.scanAndAddPageWords = () => {
  const pageFilesProg = dataReader.getDirFilePaths('./data/wikipedia/Words/Programming')
  const pagesFilesGames = dataReader.getDirFilePaths('./data/wikipedia/Words/Games')

  searcher.addPageFilesWords(pageFilesProg, './data/wikipedia/Words/Programming/')
  searcher.addPageFilesWords(pagesFilesGames, './data/wikipedia/Words/Games/')
}

module.exports = searcher
